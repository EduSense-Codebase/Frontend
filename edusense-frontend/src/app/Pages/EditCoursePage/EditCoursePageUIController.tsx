import React from 'react';
import { useState } from 'react';
import './EditCoursePageUIController.scss';
import Button from '../../ui_components/Button';

interface Props {
  courseTitle: string;
	onAddElement: () => void;
	onCustomize: () => void;
	onSave: () => void;
}

const EditCoursePageUIController: React.FC<Props> = ({
  courseTitle,
	onCustomize,
	onAddElement,
	onSave
}) => {
	const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  return (
    <div className="edit-course-page">
			<div className="header-container">
				<div className="customize-button-container">
					<Button displayName="Customize" onClick={onCustomize} variant="primary" icon="/edit.svg"/>
				</div>
				<h1 className="header">{courseTitle}</h1>
			</div>
			
			<button className="add-element-btn" onClick={onAddElement}>
				<img src="/plus_icon.png" />
				<p>Add Element</p>
			</button>


			{!editMode && (<div className="edit-btn-container">
					<Button displayName="Edit Page" onClick={toggleEditMode} variant="primary" icon="/edit.svg"/>
			</div>)}

			{editMode && (<div className="edit-footer">
				<div className="footer-btn-container">
					<button className="footer-btn" onClick={() => alert('Edit clicked')}>
						<img src="edit2.svg" alt="Edit" />
						<p className="footer-btn-description">Edit</p>
					</button>
					<button className="footer-btn" onClick={() => alert('Text Box clicked')}>
						<img src="text.svg" alt="Text Box" />
						<p className="footer-btn-description">Text Box</p>
					</button>
					<button className="footer-btn" onClick={() => alert('Section clicked')}>
						<img src="cube.svg" alt="Section" />
						<p className="footer-btn-description">Section</p>
					</button>
				</div>
				<div className="save-btn-container">
					<Button displayName="Cancel" onClick={toggleEditMode} variant="secondary"/>
					<Button displayName="Save" onClick={onSave} variant="primary" icon="save.svg"/>
				</div>
			</div>)}
    </div>
  );
};

export default EditCoursePageUIController;
