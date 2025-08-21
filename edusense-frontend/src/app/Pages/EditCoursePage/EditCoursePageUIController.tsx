import React from 'react';
import { useState } from 'react';
import './EditCoursePageUIController.scss';
import Button from '../../ui_components/Button';
import Dropdown from '../../ui_components/Dropdown';
import { IAssignments, ICourse, IModules } from '@/app/typedef';
import ToDo from '@/app/ui_components/ToDo/ToDo';
import CurrentModule from '@/app/ui_components/CurrentModule/CurrentModule';
import { API_PREFIX, COURSE_ENDPOINT } from '@/app/global';
import { httpPost } from '@/app/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    course: ICourse | undefined;
    editMode: boolean;
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    bannerImage: string | null;
    allModules: IModules[];
    showToDoWidget: boolean;
    showModuleWidget: boolean;
    setShowModuleWidget: React.Dispatch<React.SetStateAction<boolean>>;
    setBannerImage: React.Dispatch<React.SetStateAction<string | null>>;
    setShowToDoWidget: React.Dispatch<React.SetStateAction<boolean>>;
    assignments: IAssignments[];
    originalValues: any;
}

const EditCoursePageUIController: React.FC<Props> = ({
    course,
    editMode,
    setEditMode,
    bannerImage,
    allModules,
    showToDoWidget,
    showModuleWidget,
    setShowModuleWidget,
    setShowToDoWidget,
    setBannerImage,
    originalValues,
    assignments,
}) => {
    // const [editMode, setEditMode] = useState(false);
    const [sideBarOpen, setSidebarOpen] = useState(false);
    const [chooseModule, setChooseModule] = useState(false);
    const [textBoxStyle, setTextBoxStyle] = useState('');
    const [classModule, setClassModule] = useState('');
    // const [bannerImage, setBannerImage] = useState<string | null>(null);
    const [showCustomize, setShowCustomize] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const titles = allModules?.map((module) => module.title) ?? [];

    const toggleSidebar = () => {
        setSidebarOpen(!sideBarOpen);
    };

    const cancelEdit = () => {
        if (originalValues) {
            setBannerImage(originalValues.bannerImage);
            setShowModuleWidget(originalValues.showModuleWidget);
            setShowToDoWidget(originalValues.showToDoWidget);
            setTextBoxStyle(originalValues.textBoxStyle);
        }
        setEditMode(false);
        setSidebarOpen(false);
    };

    const saveData = () => {
        const url = API_PREFIX + COURSE_ENDPOINT;
        const formData = {
            course_id: course?.id,
            config: {
                moduleWidgetConfig: showModuleWidget,
                todoWidgetConfig: showToDoWidget,
                bannerImageConfig: bannerImage,
            },
        };
        console.log('formdata ', formData);
        const queryParams = { section: 'post_homepage_data' };
        const requestResponse = httpPost<any>(url, formData, queryParams);
        requestResponse.then((res) => {
            console.log('now the configs: ', res.data);
            setEditMode(false);
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setBannerImage(reader.result as string);
                setShowCustomize(false);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="main-container">
            <motion.div 
                className="edit-course-page"
                initial={{ width: '100%' }}
                animate={{ width: sideBarOpen ? '75%' : '100%' }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
                <div className="header-container">
                    <div
                        className="course-header"
                        style={{
                            backgroundImage: bannerImage ? `url(${bannerImage})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        {course?.course_name}
                    </div>
                    <div className="customize-button-container">
                        {editMode && (
                            <Button
                                displayName="Customize"
                                onClick={() => setShowCustomize(true)}
                                variant="primary"
                                icon="/edit.svg"
                            />
                        )}
                    </div>
                </div>

                {editMode && (
                    <button className="add-element-btn" onClick={toggleSidebar}>
                        <img src="/plus_icon.png" alt="" />
                        <p>Add Element</p>
                    </button>
                )}

                <div>
                    {showToDoWidget && (
                        <ToDo
                            editMode={editMode}
                            setShowToDo={setShowToDoWidget}
                            assignments={assignments}
                        />
                    )}
                    {showModuleWidget && (
                        <CurrentModule
                            moduleName={classModule}
                            editMode={editMode}
                            setModule={setShowModuleWidget}
                        />
                    )}
                </div>

                {editMode && (
                    <div className="edit-footer">
                        {/* <div className="footer-btn-container">
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
					</div> */}
                        <div className="save-btn-container">
                            <Button
                                displayName="Save"
                                onClick={saveData}
                                variant="primary"
                                icon="/save.svg"
                            />
                            <Button displayName="Cancel" onClick={cancelEdit} variant="secondary" />
                        </div>
                    </div>
                )}
            </motion.div>
            <AnimatePresence mode="wait">
                {sideBarOpen && (
                    <motion.div
                        key="sidebar"
                        className={"edit-sidebar"}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                    >

                        <button onClick={toggleSidebar} className="close-sidebar-btn">
                            <img src="/back.svg" alt="back arrow" />
                        </button>
                        <div className="sidebar-content">
                            <div className="sidebar-header">
                                <img src="/text.svg" alt="Text Box Icon" className="sidebar-icon" />
                                <h2> Text Box </h2>
                            </div>
                            <div className="element-options">
                                <h3>Text Styles</h3>
                                <Dropdown
                                    value={textBoxStyle}
                                    options={['Heading', 'Subheading', 'Paragraph']}
                                    placeholder="Select Style"
                                    onChange={(newValue) => setTextBoxStyle(newValue)}
                                />
                            </div>
                            <div className="sidebar-header">
                                <img src="/cube.svg" alt="Section Icon" className="sidebar-icon" />
                                <h2> Sections </h2>
                            </div>
                            <div className="element-options">
                                <Button
                                    displayName="Add To-Do Widget"
                                    variant="primary"
                                    onClick={() => setShowToDoWidget(true)}
                                />
                                <Button
                                    displayName="Add Current Module Widget"
                                    variant="primary"
                                    onClick={() => setChooseModule(true)}
                                />
                                {chooseModule && (
                                    <Dropdown
                                        value={classModule}
                                        options={titles}
                                        placeholder="Select Module"
                                        onChange={(newValue) => setClassModule(newValue)}
                                    />
                                )}
                                {chooseModule && (
                                    <Button
                                        displayName="Add"
                                        variant="primary"
                                        onClick={() => setShowModuleWidget(true)}
                                    />
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {showCustomize && (
                <div className="modal">
                    <div className="modal-content">
                        <h1>Customize Course Banner</h1>
                        {/* Upload option */}
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                            <div
                                className="upload-btn"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <img
                                    src="/upload.svg"
                                    alt="Upload"
                                    style={{ width: 40, height: 40 }}
                                />
                                <span>Upload Image</span>
                            </div>
                        </div>
                        <p>or</p>
                        {/* Preset options */}
                        <div className="preset">
                            <h3>Choose from Library</h3>
                            <div className="preset-images">
                                {[
                                    '/banner1.jpg',
                                    '/banner2.jpg',
                                    '/banner3.jpg',
                                    '/banner4.jpg',
                                ].map((img) => (
                                    <img
                                        key={img}
                                        src={img}
                                        alt="preset banner"
                                        onClick={() => {
                                            setBannerImage(img);
                                            setShowCustomize(false);
                                        }}
                                        className="preset-image"
                                    />
                                ))}
                            </div>
                        </div>

                        <Button
                            displayName="Close"
                            variant="secondary"
                            onClick={() => setShowCustomize(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditCoursePageUIController;
