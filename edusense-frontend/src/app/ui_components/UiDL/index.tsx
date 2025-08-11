type UIComponentProps = {
  [key: string]: any;
};

type UIComponent = {
  type: string;
  name: string;
  props: UIComponentProps;
};

type UIDL = {
  UI: UIComponent[];
  STATE: Record<string, any>;
  DATASOURCE: Record<string, any>;
};

function parseUIDL(uidlText: string): UIDL {
  const lines = uidlText.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  const sections = { UI: [], STATE: [], DATASOURCE: [] };
  let currentSection: "UI" | "STATE" | "DATASOURCE" | null = null;

  for (const line of lines) {
    if (line === "UI:") currentSection = "UI";
    else if (line === "STATE:") currentSection = "STATE";
    else if (line === "DATASOURCE:") currentSection = "DATASOURCE";
    else if (currentSection) sections[currentSection].push(line);
  }

  // Parse STATE section
  const state: Record<string, any> = {};
  for (const line of sections.STATE) {
    const m = line.match(/(string|number|boolean)\s+(\w+)\s*=\s*(.+)/);
    if (m) {
      const [, type, name, rawVal] = m;
      let val: any = rawVal;
      if (type === "string") val = rawVal.replace(/^"|"$/g, "");
      else if (type === "number") val = Number(rawVal);
      else if (type === "boolean") val = rawVal === "true";
      state[name] = val;
    }
  }

  // Parse UI section
  const uiComponents: UIComponent[] = [];
  let i = 0;
  while (i < sections.UI.length) {
    const header = sections.UI[i];
    const m = header.match(/(\w+)\s+(\w+)\s*{/);
    if (!m) throw new Error(`Invalid UI component declaration: ${header}`);
    const [, type, name] = m;
    i++;
    const props: UIComponentProps = {};
    while (i < sections.UI.length && sections.UI[i] !== "}") {
      const propLine = sections.UI[i];
      const eqIndex = propLine.indexOf("=");
      if (eqIndex < 0) throw new Error(`Invalid property line: ${propLine}`);
      const key = propLine.slice(0, eqIndex).trim();
      let value = propLine.slice(eqIndex + 1).trim();

      // Parse values
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("[")) {
        try {
          value = JSON.parse(value);
        } catch {
          throw new Error(`Invalid array value: ${value}`);
        }
      } else if (value === "true") {
        value = true;
      } else if (value === "false") {
        value = false;
      } else if (/^\$/.test(value)) {
        value = { stateBinding: value.slice(1) };
      } else if (/^@/.test(value)) {
        value = { dataBinding: value.slice(1) };
      } else if (/^[a-zA-Z_]\w*$/.test(value)) {
        // Could be action name
        value = { action: value };
      }
      props[key] = value;
      i++;
    }
    i++; // skip closing }
    uiComponents.push({ type, name, props });
  }

  // Parse DATASOURCE section (very basic)
  const datasource: Record<string, string> = {};
  for (const line of sections.DATASOURCE) {
    const m = line.match(/(\w+)\s*=\s*db\.collection\("(\w+)"\)/);
    if (m) {
      const [, name, collection] = m;
      datasource[name] = collection;
    }
  }

  return { UI: uiComponents, STATE: state, DATASOURCE: datasource };
}

// React Renderer (simplified)
import React, { useState } from "react";

type UIDLRendererProps = {
  uidlText: string;
};

export const UIDLRenderer: React.FC<UIDLRendererProps> = ({ uidlText }) => {
  const { UI, STATE } = parseUIDL(uidlText);
  const [state, setState] = useState(STATE);

  // Handle action stub
  const handleAction = (name: string) => () => {
    alert(`Action triggered: ${name}`);
  };

  const renderComponent = (comp: UIComponent) => {
    console.log(comp);
    const props = { ...comp.props };

    // Resolve bindings
    /*
    Object.entries(props).forEach(([key, val]) => {
      if (val && typeof val === "object" && "stateBinding" in val) {
        props[key] = state[val.stateBinding];
      }
    });
    */

    switch (comp.type) {
      case "Text":
        return <div key={comp.name}>{props.value}</div>;

      case "InputField":
  {
    const bindName = props.bind?.stateBinding;
    return (
      <div key={comp.name}>
        <label>{props.label}</label>
        <input
          type="text"
          placeholder={props.placeholder}
          value={bindName ? state[bindName] : ""}
          onChange={(e) => {
            if (bindName) {
              setState((s) => ({ ...s, [bindName]: e.target.value }));
            }
          }}
        />
      </div>
    );
  }

case "RadioField":
  {
    const bindName = props.bind?.stateBinding;
    return (
      <div key={comp.name}>
        <label>{props.label}</label>
        {Array.isArray(props.options) &&
          props.options.map((opt: string) => (
            <label key={opt}>
              <input
                type="radio"
                checked={bindName ? state[bindName] === opt : false}
                onChange={() => {
                  console.log(bindName)
                  if (bindName) {
                    setState((s) => ({ ...s, [bindName]: opt }));
                  }
                }}
              />
              {opt}
            </label>
          ))}
      </div>
    );
  }

      case "Button":
        return (
          <button
            key={comp.name}
            onClick={
              props.onClick && props.onClick.action
                ? handleAction(props.onClick.action)
                : undefined
            }
          >
            {props.label}
          </button>
        );

      default:
        return <div key={comp.name}>Unsupported component: {comp.type}</div>;
    }
  };

  return <>{UI.map(renderComponent)}</>;
};
