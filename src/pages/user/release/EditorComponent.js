import React, {Component} from 'react'
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill'; // ES6
import styles from './EditorComponent.less'
import 'react-quill/dist/quill.snow.css'; // ES6
/*
 * Custom "star" icon for the toolbar using an Octicon
 * https://octicons.github.io
 */
const CustomButton = () => <span className="octicon octicon-star" />;

/*
 * Event handler to be attached using Quill toolbar module (see line 73)
 * https://quilljs.com/docs/modules/toolbar/
 */
function insertStar() {
    const cursorPosition = this.quill.getSelection().index;
    this.quill.insertText(cursorPosition, "★");
    this.quill.setSelection(cursorPosition + 1);
}

/*
 * Custom toolbar component including insertStar button and dropdowns
 */
const CustomToolbar = () => (
    <div id="toolbar">
        <div>
            信息内容
        </div>
    </div>
);

/*
 * Editor component with custom toolbar and content containers
 */
const Editor = (props) => {
    return (
        <div className={styles.text_editor}>
            <style>
                {`.ql-editor{padding: 10px;min-height: 150px;}`}
            </style>
            <CustomToolbar />
            <ReactQuill
                onChange={props.handleChange}
                placeholder={props.placeholder}
                modules={Editor.modules}
                formats={Editor.formats}
                theme={"snow"} // pass false to use minimal theme
            />
        </div>
    );
}

/*
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
Editor.modules = {
    toolbar: {
        container: "#toolbar",
        handlers: {
            insertStar: insertStar
        }
    },
    clipboard: {
        matchVisual: false,
    }
};

/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
Editor.formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color"
];

/*
 * PropType validation
 */
Editor.propTypes = {
    placeholder: PropTypes.string
};

/*
 * Render component on page
 */
export default Editor