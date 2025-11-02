import React from 'react';
import Button from '../Button';
import toast from 'react-hot-toast';

interface ISectionsPanelProps {
    sections: string[];
    addSection: (sectionName: string) => void;
}

const SectionsPanel: React.FC<ISectionsPanelProps> = (props: ISectionsPanelProps) => {
    const [sectionName, setSectionName] = React.useState('');

    const onSectionSubmit = () => {
        const cleanName = sectionName.trim();

        // Prevent empty input
        if (!cleanName) {
            toast.error('Section name cannot be empty');
            return;
        }

        // Prevent duplicates (case-insensitive)
        const duplicate = props.sections.some(
            (s) => s.trim().toLowerCase() === cleanName.toLowerCase(),
        );
        if (duplicate) {
            toast.error('This section already exists');
            return;
        }

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
