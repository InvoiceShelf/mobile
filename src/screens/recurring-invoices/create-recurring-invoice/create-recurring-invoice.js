import React, {Component} from 'react';
import {Field, change, initialize} from 'redux-form';
import t from 'locales/use-translation';
import {IProps, IStates} from './create-recurring-invoice-type';
import {routes} from '@/navigation';
import {alertMe, isEmpty} from '@/constants';
import {CREATE_RECURRING_INVOICE_FORM} from 'stores/recurring-invoices/types';
import {
  DefaultLayout,
  DatePickerField,
  CustomField,
  Notes,
  ItemField,
  ToggleSwitch,
  FinalAmount,
  InputField,
  BaseButtonGroup,
  BaseButton
} from '@/components';
import {
  fetchRecurringInvoiceInitialDetails,
  fetchSingleRecurringInvoice,
  addRecurringInvoice,
  updateRecurringInvoice,
  removeRecurringInvoice,
  fetchNextInvoiceAt
} from 'stores/recurring-invoices/actions';
import {CustomerSelectModal, StatusSelectModal} from '@/select-modal';
import {TemplateField} from '@/components';
import styles from './create-recurring-invoice-styles';
import {FrequencyField, LimitField} from '../recurring-invoices-common';
import {statusSelector} from 'stores/recurring-invoices/selectors';
import {NOTES_TYPE_VALUE} from '@/features/settings/constants';
import {
  total,
  tax,
  CompoundTax,
  getCompoundTaxValue,
  totalDiscount,
  getTaxValue,
  getItemList,
  finalAmount
} from '@/components/final-amount/final-amount-calculation';
import {setCalculationRef} from 'stores/common/helpers';
import {getApiFormattedCustomFields, secondaryHeader} from '@/utils';
import moment from 'moment';

export default class CreateRecurringInvoice extends Component<IProps, IStates> {
  recurringInvoiceRefs: any;
  sendMailRef: any;
  customerReference: any;

  constructor(props) {
    super(props);
    this.recurringInvoiceRefs = setCalculationRef.bind(this);
    this.sendMailRef = React.createRef();
    this.customerReference = React.createRef();
    this.state = {
      currency: props?.currency,
      isFetchingInitialData: true
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const {isCreateScreen, id, dispatch} = this.props;
    if (isCreateScreen) {
      dispatch(
        fetchRecurringInvoiceInitialDetails(() => this.setInitialData(null))
      );
      return;
    }

    dispatch(
      fetchSingleRecurringInvoice(id, invoice => this.setInitialData(invoice))
    );
  };

  setInitialData = invoice => {
    if (invoice) {
      const {dispatch} = this.props;
      dispatch(initialize(CREATE_RECURRING_INVOICE_FORM, invoice));
    }
    this.fetchNextInvoice();
    this.setState({isFetchingInitialData: false});
  };

  onSave = values => {
    const {
      navigation,
      id,
      isCreateScreen,
      dispatch,
      isSaving,
      isDeleting
    } = this.props;

    if (isSaving || isDeleting || this.state.isFetchingInitialData) {
      return;
    }

    if (finalAmount() < 0) {
      alertMe(t('invoices.alert.less_amount'));
      return;
    }

    let invoice = {
      ...values,
      total: finalAmount(),
      sub_total: total(),
      tax: tax() + CompoundTax(),
      discount_val: totalDiscount(),
      taxes: values.taxes
        ? values.taxes.map(val => {
            return {
              ...val,
              amount: val.compound_tax
                ? getCompoundTaxValue(val.percent)
                : getTaxValue(val.percent)
            };
          })
        : []
    };

    const params = {
      invoice: {
        ...invoice,
        id,
        customFields: getApiFormattedCustomFields(values?.customFields)
      },
      navigation,
      onSuccess: () => {
        navigation.navigate(routes.RECURRING_INVOICES);
      }
    };

    isCreateScreen
      ? dispatch(addRecurringInvoice(params))
      : dispatch(updateRecurringInvoice(params));
  };

  removeRecurringInvoice = () => {
    const {id, dispatch} = this.props;

    function confirmationAlert(remove) {
      alertMe({
        title: t('alert.title'),
        desc: t('users.text_alert_description'),
        showCancel: true,
        okPress: remove
      });
    }

    confirmationAlert(() => dispatch(removeRecurringInvoice(id)));
  };

  setFormField = (field, value) => {
    const {dispatch} = this.props;
    dispatch(change(CREATE_RECURRING_INVOICE_FORM, field, value));
  };

  navigateToRole = () => {
    const {navigation} = this.props;
    navigation.navigate(routes.CREATE_ROLE, {
      type: 'ADD',
      onSelect: item => this.setFormField(`role`, item.name)
    });
  };

  getInvoiceItemList = selectedItems => {
    this.setFormField('items', selectedItems);

    const {currency} = this.state;

    if (isEmpty(selectedItems)) {
      return [];
    }

    return selectedItems.map(item => {
      let {name, description, price, quantity, total} = item;

      return {
        title: name,
        subtitle: {
          title: description,
          labelComponent: (
            <CurrencyFormat
              amount={price}
              currency={currency}
              preText={`${quantity} * `}
              style={styles.itemLeftSubTitle(this.props.theme)}
              containerStyle={styles.itemLeftSubTitleLabel}
            />
          )
        },
        amount: total,
        currency,
        fullItem: item
      };
    });
  };

  fetchNextInvoice = () => {
    const {
      formValues: {starts_at, frequency},
      dispatch,
      dateFormat
    } = this.props;
    const params = {
      starts_at,
      frequency
    };
    dispatch(
      fetchNextInvoiceAt({
        params,
        onSuccess: data => {
          if (data?.success) {
            let nextInvDate = moment(data?.next_invoice_at).format(dateFormat);
            this.setFormField('next_invoice_at', nextInvDate);
          }
        }
      })
    );
  };

  navigateToCustomer = () => {
    const {navigation} = this.props;
    const {currency} = this.state;

    navigation.navigate(routes.CUSTOMER, {
      type: 'ADD',
      currency,
      onSelect: item => {
        this.customerReference?.changeDisplayValue?.(item);
        this.setFormField('customer_id', item.id);
        this.setState({currency: item.currency});
      }
    });
  };

  render() {
    const {
      isEditScreen,
      isAllowToEdit,
      isAllowToDelete,
      formValues,
      customers,
      fetchStatus,
      getCustomers,
      selectedItems,
      items,
      getItems,
      customFields,
      navigation,
      statusList,
      notes,
      getNotes,
      isSaving,
      isDeleting,
      invoiceTemplates = [],
      formValues: {
        limit_by,
        limit_date,
        limit_count,
        frequency,
        frequency_picker,
        status
      }
    } = this.props;
    const hasCustomField = isEditScreen
      ? formValues && formValues.hasOwnProperty('fields')
      : !isEmpty(customFields);
    const {isFetchingInitialData} = this.state;
    const disabled = !isAllowToEdit;
    this.recurringInvoiceRefs(this);

    const headerProps = secondaryHeader({
      ...this.props,
      rightIconPress: this.props.handleSubmit(this.onSave)
    });

    const bottomAction = (
      <BaseButtonGroup>
        <BaseButton
          show={isAllowToEdit}
          loading={isSaving}
          disabled={isFetchingInitialData || isDeleting}
          onPress={this.props.handleSubmit(this.onSave)}
        >
          {t('button.save')}
        </BaseButton>
        <BaseButton
          type="danger"
          show={isEditScreen && isAllowToDelete}
          loading={isDeleting}
          disabled={isFetchingInitialData || isSaving}
          onPress={this.removeRecurringInvoice}
        >
          {t('button.remove')}
        </BaseButton>
      </BaseButtonGroup>
    );

    return (
      <DefaultLayout
        headerProps={headerProps}
        bottomAction={bottomAction}
        loadingProps={{is: isFetchingInitialData}}
      >
        <Field
          name="customer_id"
          getCustomers={getCustomers}
          customers={customers}
          component={CustomerSelectModal}
          selectedItem={formValues?.customer}
          onSelect={item => {
            this.setFormField('customer_id', item.id);
            this.setState({currency: item.currency});
          }}
          rightIconPress={this.navigateToCustomer}
          reference={ref => (this.customerReference = ref)}
          disabled={disabled}
        />

        <Field
          name={'starts_at'}
          isRequired
          component={DatePickerField}
          label={t('recurring_invoices.start_date')}
          icon={'calendar-alt'}
          onChangeCallback={val => {
            this.setFormField('starts_at', val);
            this.fetchNextInvoice();
          }}
          disabled={disabled}
        />
        <Field
          name="next_invoice_at"
          component={InputField}
          inputProps={{}}
          meta={{}}
          hint={t('recurring_invoices.next_invoice_at')}
          leftIcon={'calendar-alt'}
          disabled
        />

        <LimitField
          limitByField={{
            name: 'limit_by',
            value: limit_by,
            onChangeCallback: value => this.setFormField('limit_by', value)
          }}
          limitDateField={{
            name: 'limit_date',
            value: limit_date
          }}
          limitCountField={{
            name: 'limit_count',
            value: limit_count
          }}
        />

        <Field
          name="status"
          statusList={statusSelector(statusList)}
          fetchStatus={fetchStatus}
          component={StatusSelectModal}
          placeholder={status ?? t('recurring_invoices.status.title')}
          onSelect={item => {
            this.setFormField('status', item);
          }}
          disabled={disabled}
        />

        <FrequencyField
          frequencyPickerField={{
            name: 'frequency_picker',
            value: frequency_picker
          }}
          frequencyField={{
            name: 'frequency',
            value: frequency
          }}
          onChangeCallback={val => {
            if (!val) {
              return;
            }
            this.setFormField('frequency', val);
            this.fetchNextInvoice();
          }}
          callbackWhenMount={() => {
            this.setFormField('frequency_picker', frequency);
          }}
        />

        <ItemField
          {...this.props}
          currency={this.state.currency}
          selectedItems={selectedItems}
          items={getItemList(items)}
          getItems={getItems}
          screen="recurring_invoice"
          setFormField={this.setFormField}
        />

        <FinalAmount {...this.props} currency={this.state.currency} />

        <Notes
          {...this.props}
          navigation={navigation}
          notes={notes}
          getNotes={getNotes}
          isEditScreen={isEditScreen}
          noteType={NOTES_TYPE_VALUE.RECURRING_INVOICE}
          onSelect={this.setFormField}
        />

        <Field
          name="template_name"
          templates={invoiceTemplates ?? []}
          component={TemplateField}
          label={t('invoices.template')}
          icon={'file-alt'}
          placeholder={t('invoices.template_placeholder')}
          navigation={navigation}
          disabled={disabled}
          isRequired
        />

        <Field
          name={'send_automatically'}
          component={ToggleSwitch}
          hint={t('recurring_invoices.auto_sent.label')}
          description={t('recurring_invoices.auto_sent.description')}
        />

        {hasCustomField && <CustomField {...this.props} type={null} />}
      </DefaultLayout>
    );
  }
}
