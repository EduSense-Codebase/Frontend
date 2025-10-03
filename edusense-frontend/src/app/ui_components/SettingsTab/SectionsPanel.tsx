import React from 'react';
import Button from '../Button';

interface ISectionsPanelProps {
    sections: string[];
    addSection: (sectionName: string) => void;
}

const SectionsPanel: React.FC<ISectionsPanelProps> = (props: ISectionsPanelProps) => {
    const [sectionName, setSectionName] = React.useState('');

    const onSectionSubmit = () => {
        props.addSection(sectionName);
        setSectionName('');
    };

    return (
        <div className="panel">
            <h3>Sections</h3>

            <div className="ta-list">
                {props.sections.length
                    ? props.sections.map((section, index) => {
                          return (
                              <div className="ta-card" key={index}>
                                  <div className="ta-left">
                                      <div className="ta-name">{section}</div>
                                  </div>
                              </div>
                          );
                      })
                    : null}
            </div>

            <div className="add-ta">
                <input
                    className="add-email"
                    placeholder="Section Name"
                    value={sectionName}
                    onChange={(e) => setSectionName(e.target.value)}
                />

                <div className="add-row">
                    <Button
                        displayName="+ Add Section"
                        variant="primary"
                        onClick={onSectionSubmit}
                    />
                </div>
            </div>
        </div>
    );
};

export default SectionsPanel;
