# 🧠 EduSense Frontend Development Guidelines

This document outlines the **React component and page development structure**, **styling conventions**, and **Storybook naming conventions** for the EduSense project.

---

## 📁 1. React Component and Pages Development Structure

### 1a. UI Components

All reusable UI components are placed under the `ui_components/` directory. Each component follows this structure:

```
ui_components/
├── Button/
│   ├── index.tsx              # Component source
│   ├── Button.scss            # Component-specific styling
│   └── __stories__/
│       └── Button.stories.tsx # Storybook config
```

**Guidelines:**
- Each component has its own folder.
- `index.tsx` contains the component logic.
- `{ComponentName}.scss` contains SCSS styles specific to the component.
- Storybook stories go inside a `__stories__` subfolder to separate them from the main logic.

---

### 1b. Page Views

Each page is split into two layers:

#### 🧠 Controller Component (`page.tsx`)
- Contains **backend logic**: data fetching, state management, and event handlers.
- Passes necessary data and handlers to the UI layer.

#### 🎨 UIController Component
- A **pure React component**.
- Accepts all data and handlers as props.
- Only responsible for **rendering UI**.

**Structure:**
```
pages/
├── Dashboard/
│   ├── DashboardUIController.tsx   # Pure UI component
│   ├── DashboardUIController.scss  # Styles specific to this page
│   ├── __stories__/
│   │   └── DashboardUIController.stories.tsx # Storybook with mock data
│   └── page.tsx                    # Controller (logic & data layer)
```

**Storybook stories** for pages only test the `UIController` component using **mock data** to validate visual and UI behavior independently of backend logic.

---

## 🎨 2. Styling Guidelines

- We use **SCSS** instead of plain CSS for improved modularity and maintainability.
- SCSS supports **variables, nesting, mixins, and functions**, which are essential for theme consistency.

### Component-Level Styling
- Each UI component has its own `.scss` file placed in the same folder as the component.

### Global Styling
- Global variables and utility styles are located in shared `.scss` files (e.g., spacing, theme, typography).

**Example Structure:**
```
styles/
├── _variables.scss   # Theme variables (colors, spacing, fonts, etc.)
├── _mixins.scss      # Reusable SCSS mixins
└── main.scss         # Global entry point
```

---

## 📚 3. Storybook Naming Conventions

To ensure consistent organization within Storybook:

### 🔧 UI Components
Use the following naming convention:
```
EduSense/Component/{ComponentName}
```
**Example:** `EduSense/Component/Button`

### 📄 UIController Components (Page UI)
Use the following naming convention:
```
EduSense/Pages/{PageName}
```
**Example:** `EduSense/Pages/Dashboard`

---

## ✅ Summary

| Area                 | Rule                                                                 |
|----------------------|----------------------------------------------------------------------|
| UI Components        | `ui_components/ComponentName/` with `index.tsx`, `.scss`, and stories|
| Page Views           | Split into `UIController.tsx` and `page.tsx`                         |
| Styles               | SCSS per component + global SCSS                                     |
| Storybook (UI)       | `EduSense/Component/{ComponentName}`                                 |
| Storybook (Pages)    | `EduSense/Pages/{PageName}`                                          |

---
