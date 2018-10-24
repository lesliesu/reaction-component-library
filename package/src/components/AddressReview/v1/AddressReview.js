import React, { Component } from "react";
import PropTypes from "prop-types";
import uniqueId from "lodash.uniqueid";
import { Form } from "reacto-form";
import styled from "styled-components";
import { withComponents } from "@reactioncommerce/components-context";
import { applyTheme, CustomPropTypes } from "../../../utils";

const FormWrapper = styled.div`
  margin-top: ${applyTheme("AddressReview.formSpacingTop")};
`;

const ENTERED = "entered";
const SUGGESTED = "suggested";

class AddressReview extends Component {
  static propTypes = {
    /**
     * Address entered
     */
    addressEntered: CustomPropTypes.address.isRequired,
    /**
     * Address validations address suggestion
     */
    addressSuggestion: CustomPropTypes.address.isRequired,
    /**
     * You can provide a `className` prop that will be applied to the outermost DOM element
     * rendered by this component. We do not recommend using this for styling purposes, but
     * it can be useful as a selector in some situations.
     */
    className: PropTypes.string,
    /**
     * If you've set up a components context using @reactioncommerce/components-context
     * (recommended), then this prop will come from there automatically. If you have not
     * set up a components context or you want to override one of the components in a
     * single spot, you can pass in the components prop directly.
     */
    components: PropTypes.shape({
      /**
       * Pass either the Reaction Address component or your own component that
       * accepts compatible props.
       */
      Address: CustomPropTypes.component.isRequired,
      /**
       * Pass either the Reaction Checkbox component or your own component that
       * accepts compatible props.
       */
      Checkbox: CustomPropTypes.component.isRequired,
      /**
       * Pass either the Reaction Field component or your own component that
       * accepts compatible props.
       */
      Field: CustomPropTypes.component.isRequired,
      /**
       * Pass either the Reaction InlineAlert component or your own component that
       * accepts compatible props
       */
      InlineAlert: CustomPropTypes.component.isRequired
    }).isRequired,
    /**
     * Is data being saved
     */
    isSaving: PropTypes.bool,
    /**
     * Form name
     */
    name: PropTypes.string,
    /**
     * Form submit event callback
     */
    onSubmit: PropTypes.func,
    /**
     * The selected address option
     */
    value: PropTypes.string,
    /**
     * Warning message copy to display above the form
     */
    warningMessage: PropTypes.string,
    /**
     * Warning message title to display above the form
     */
    warningTitle: PropTypes.string
  };

  static defaultProps = {
    isSaving: false,
    value: SUGGESTED,
    // eslint-disable-next-line
    warningMessage: "Please review our suggestion below, and choose which version you’d like to use. Possible errors are shown in red.",
    warningTitle: "The address you entered may be incorrect or incomplete."
  };

  _form = null;

  uniqueInstanceIdentifier = uniqueId("AddressReviewForm_");

  /**
   *
   * @name submit
   * @summary Instance method that submits the form, this allows a parent component access to the Form submit event.
   * @return {Undefined} - Nothing
   */
  submit = () => {
    this._form.submit();
  };

  /**
   *
   * @name invalidAddressProperties
   * @summary Creates an array of invalid address property keys.
   * @return {Array} - `["address1", "postal"]`
   */
  get invalidAddressProperties() {
    const { addressEntered, addressSuggestion } = this.props;
    return (
      addressEntered &&
      Object.keys(addressEntered).filter((key) => (addressEntered[key] !== addressSuggestion[key] ? key : null))
    );
  }

  /**
   *
   * @name handleSubmit
   * @summary Form `onSubmit` callback that check the submitted value
   * and passes the correct address object to the `props.onSubmit` function.
   * @param {String} value - "entered" or "seggested"
   * @return {Undefined} - Nothing
   */
  handleSubmit = ({ AddressReview: value }) => {
    const { addressEntered, addressSuggestion, onSubmit } = this.props;
    const selectedAddress = value === ENTERED ? addressEntered : addressSuggestion;
    onSubmit(selectedAddress);
  };

  render() {
    const {
      addressEntered,
      addressSuggestion,
      className,
      components: { Address, InlineAlert, SelectableList },
      isSaving,
      value,
      warningMessage,
      warningTitle
    } = this.props;

    const options = [
      {
        id: `${ENTERED}_${this.uniqueInstanceIdentifier}`,
        detail: <Address address={addressEntered} invalidAddressProperties={this.invalidAddressProperties} />,
        label: "Entered Address:",
        value: ENTERED
      },
      {
        id: `${SUGGESTED}_${this.uniqueInstanceIdentifier}`,
        detail: <Address address={addressSuggestion} />,
        label: "Suggested Address:",
        value: SUGGESTED
      }
    ];

    return (
      <div className={className}>
        <InlineAlert alertType="warning" title={warningTitle} message={warningMessage} />
        <FormWrapper>
          <Form
            ref={(formEl) => {
              this._form = formEl;
            }}
            onSubmit={this.handleSubmit}
          >
            <SelectableList
              isHorizontal
              isStacked
              options={options}
              name="AddressReview"
              value={value}
              isReadOnly={isSaving}
            />
          </Form>
        </FormWrapper>
      </div>
    );
  }
}

export default withComponents(AddressReview);