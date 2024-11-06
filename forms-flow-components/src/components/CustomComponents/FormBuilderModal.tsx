import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { CustomButton } from "./Button";
import { FormTextArea } from "./FormTextArea";
import { CloseIcon } from "../SvgIcons/index";
import { FormInput } from "./FormInput";
import { useTranslation } from "react-i18next";
import { CustomInfo } from "./CustomInfo";
import { Form } from "react-bootstrap";

interface BuildFormModalProps {
  showBuildForm: boolean;
  onClose?: () => void;
  handleChange?: (
    field: string,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  primaryBtnAction?: (name: string, description: string) => void; // Now expects name and description
  secondaryBtnAction?: () => void;
  setNameError?: (value: string) => void;
  nameError?: string;
  description?: string;
  formSubmitted?: boolean;
  modalHeader?: string;
  nameLabel?: string;
  descriptionLabel?: string;
  primaryBtnLabel?: string;
  secondaryBtnLabel?: string;
  nameValidationOnBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  primaryBtndataTestid?: string;
  secondoryBtndataTestid?: string;
  primaryBtnariaLabel?: string;
  secondoryBtnariaLabel?: string;
  closedataTestid?: string;
  nameInputDataTestid?: string;
  descriptionDataTestid?: string;
  placeholderForForm?: string;
  placeholderForDescription?: string;
  buildForm?: boolean;
  checked?: boolean;
  setChecked?:()=>void;
}

export const FormBuilderModal: React.FC<BuildFormModalProps> = React.memo(
  ({
    showBuildForm,
    onClose,
    handleChange,
    primaryBtnAction,
    secondaryBtnAction = onClose, // Default to onClose if not provided
    setNameError,
    description,
    nameError,
    formSubmitted,
    modalHeader,
    nameLabel = "Name",
    descriptionLabel = "Form Description",
    primaryBtnLabel = "Save and Edit form",
    secondaryBtnLabel = "Cancel",
    nameValidationOnBlur,
    primaryBtndataTestid = "confirm-button",
    secondoryBtndataTestid = "cancel-button",
    primaryBtnariaLabel = "Create and Edit form",
    secondoryBtnariaLabel = "Cancel",
    closedataTestid = "close",
    nameInputDataTestid = "form-name",
    descriptionDataTestid = "form-description",
    placeholderForForm,
    placeholderForDescription,
    buildForm= false,
    checked= false,
    setChecked
  }) => {
    const { t } = useTranslation();
    const [values, setValues] = useState({
      name:"",
      description: description || ""
    })
    const handlePrimaryAction = () => {
      // Pass name and description to primaryBtnAction
      if (primaryBtnAction) {
        primaryBtnAction(values.name, values.description);
      }
    };

    const handleInputValueChange = (e:any)=>{
      const {name, value} = e.target;
      setValues(prev => ({...prev,[name]:value}))
    }

    useEffect(()=>{
      if(!showBuildForm){
        setValues({name:"",description:""})
      }
    },[showBuildForm])

    return (
        <Modal
          show={showBuildForm}
          onHide={onClose}
          size="sm"
          centered={true}
        >
          <Modal.Header>
            <Modal.Title>
              <b>{modalHeader}</b>
            </Modal.Title>
            <div className="d-flex align-items-center">
              <CloseIcon onClick={onClose} />
            </div>
          </Modal.Header>
          <Modal.Body className="form-builder-modal">
            <FormInput
              name="name"
              type="text"
              placeholder={placeholderForForm}
              label={nameLabel}
              aria-label={t("Name of the form")}
              data-testid={nameInputDataTestid}
              onBlur={nameValidationOnBlur}
              onChange={(event) => {
                handleInputValueChange(event);
                setNameError("");
                handleChange("title", event);
              }}
              required
              value={values.name}
              isInvalid={!!nameError}
              feedback={nameError}
            />
           <FormTextArea
              name="description"
              placeholder={placeholderForDescription}
              label={descriptionLabel}
              className="form-input"
              aria-label={t("Description of the new form")}
              data-testid={descriptionDataTestid}
              value={values.description} // Bind description state
              onChange={handleInputValueChange}
              minRows={1}
            />

           {buildForm && 
           <>
           <CustomInfo heading="Note" 
           content="Allowing the addition of multiple pages in a single form will prevent you from using this form in a bundle later" />
           <Form.Check
             type="checkbox"
             id="anonymouseCheckbox"
             label={t("Allow adding multiple pages form in this form")}
             checked={checked}
             onChange={setChecked} //TBD: need to remove and add to setValues 
             className="field-label"
             data-testid="wizard-checkbox"
           />   
          </>
          }
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-start">
            <CustomButton
              variant={nameError ? "dark" : "primary"}
              size="md"
              disabled={!!nameError || formSubmitted || !values.name } // Disable if errors or fields are empty
              label={primaryBtnLabel}
              buttonLoading={!nameError && formSubmitted ? true : false}
              onClick={handlePrimaryAction} // Use the new handler
              dataTestid={primaryBtndataTestid}
              ariaLabel={primaryBtnariaLabel}
            />

            <CustomButton
              variant="secondary"
              size="md"
              label={secondaryBtnLabel}
              onClick={secondaryBtnAction}
              dataTestid={secondoryBtndataTestid}
              ariaLabel={secondoryBtnariaLabel}
            />
          </Modal.Footer>
        </Modal>
     );
  }
);