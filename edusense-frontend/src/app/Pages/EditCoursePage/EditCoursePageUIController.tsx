import React from 'react';
import { useState } from 'react';
import './EditCoursePageUIController.scss';
import Button from '../../ui_components/Button';
import Dropdown from '../../ui_components/Dropdown';

interface Props {
  courseTitle: string;
	onCustomize: () => void;
	onSave: () => void;
}

const EditCoursePageUIController: React.FC<Props> = ({
  courseTitle,
	onCustomize,
	onSave
}) => {
	const [editMode, setEditMode] = useState(false);
	const [sideBarOpen, setSidebarOpen] = useState(false);
	const [textBoxStyle, setTextBoxStyle] = useState('');
	const [assignmentsType, setAssignmentsType] = useState('');
	const [classModule, setClassModule] = useState('');

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };
	
	const toggleSidebar = () => {
		setSidebarOpen(!sideBarOpen);
	};

	const cancelEdit = () => {
		setEditMode(false);
		setSidebarOpen(false);
		setTextBoxStyle('');
		setAssignmentsType('');
		setClassModule('');
	}

  return (
    <div className="main-container">
			<div className="edit-course-page">
				<div className="header-container">
					<h1 className="header">{courseTitle}</h1>
					<div className="customize-button-container">
						<Button displayName="Customize" onClick={onCustomize} variant="primary" icon="/edit.svg"/>
					</div>
				</div>
				
				{editMode && (
					<button className="add-element-btn" onClick={toggleSidebar}>
						<img src="/plus_icon.png" />
						<p>Add Element</p>
					</button>
				)}


				{!editMode && (
					<div className="edit-btn-container">
						<Button displayName="Edit Page" onClick={toggleEditMode} variant="primary" icon="/edit.svg"/>
					</div>
				)}

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
						<Button displayName="Save" onClick={onSave} variant="primary" icon="save.svg"/>
						<Button displayName="Cancel" onClick={cancelEdit} variant="secondary"/>

					</div>
				</div>)}
			</div>
			{sideBarOpen && (
				<div className="sidebar">
					<button onClick={toggleSidebar} className="close-sidebar-btn">
						<img src="/back.svg" alt="back arrow"/>
					</button>
					<div className="sidebar-content">
						<div className="sidebar-header">
							<img src="/text.svg" alt="Text Box Icon" className="sidebar-icon"/>
							<h2> Text Box </h2>
						</div>
						<div className="element-options">
							<h3>Text Styles</h3>
							<Dropdown 
								value={textBoxStyle} 
								options={["Heading", "Subheading", "Paragraph"]}
								placeholder="Select Style"
								onChange={(newValue) => setTextBoxStyle(newValue)}
							/>
						</div>
						<div className="sidebar-header">
							<img src="/cube.svg" alt="Section Icon" className="sidebar-icon"/>
							<h2> Sections </h2>
						</div>
						<div className="element-options">
							<h3>Assignments</h3>
							<Dropdown 
								value={assignmentsType} 
								options={["To Do", "Upcoming", "Overdue", "Due Today"]}
								placeholder="Select Timeframe"
								onChange={(newValue) => setAssignmentsType(newValue)}
							/>

							<h3>Recent Announcements</h3>
							
							<h3>Class Modules</h3>
							<Dropdown 
								value={classModule} 
								options={["Resources", "Class Notes", "Discussions"]}
								placeholder="Select Module"
								onChange={(newValue) => setClassModule(newValue)}
							/>
						</div>
					</div>
				</div>
			)}

    </div>
  );
};

export default EditCoursePageUIController;
