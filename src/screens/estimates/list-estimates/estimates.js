import React from 'react';
import {change} from 'redux-form';
import styles from './estimates-styles';
import {Tabs, MainLayout, AssetImage} from '@/components';
import {Sent, Draft, All} from './Tab';
import t from 'locales/use-translation';
import {routes} from '@/navigation';
import estimateFilterFields from './filterFields';
import {isFilterApply} from '@/utils';
import {ARROW_ICON} from '@/assets';
import {ESTIMATES_TABS, ESTIMATES_FORM, TAB_NAME} from 'stores/estimates/types';
import {EstimateServices} from 'stores/estimates/service';
import {IProps, IStates} from './estimates-type';

export default class Estimates extends React.Component<IProps, IStates> {
  draftReference: any;
  sentReference: any;
  allReference: any;
  focusListener: any;

  constructor(props) {
    super(props);
    this.draftReference = React.createRef();
    this.sentReference = React.createRef();
    this.allReference = React.createRef();

    this.state = {
      activeTab: ESTIMATES_TABS.DRAFT,
      search: ''
    };
  }

  componentDidMount() {
    this.onFocus();
  }

  componentWillUnmount() {
    this.focusListener?.remove?.();
  }

  onFocus = () => {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      if (EstimateServices.isEmailSent) {
        EstimateServices.toggleIsEmailSent(false);
      }

      if (!this.state.isLoaded) {
        this.setState({isLoaded: true});
        return;
      }

      const {ref} = this.getActiveTab();
      ref?.getItems?.();
    });
  };

  setActiveTab = activeTab => {
    this.setState({activeTab});
  };

  onSelect = estimate => {
    const {navigation} = this.props;

    navigation.navigate(routes.CREATE_ESTIMATE, {
      id: estimate.id,
      type: 'UPDATE'
    });
  };

  onSearch = search => {
    const {status, ref} = this.getActiveTab();

    this.setState({search});

    ref?.getItems?.({
      queryString: {status, search},
      showLoader: true
    });
  };

  getActiveTab = (activeTab = this.state.activeTab) => {
    if (activeTab == ESTIMATES_TABS.SENT) {
      return {
        status: ESTIMATES_TABS.SENT,
        ref: this.sentReference
      };
    }

    if (activeTab == ESTIMATES_TABS.DRAFT) {
      return {
        status: ESTIMATES_TABS.DRAFT,
        ref: this.draftReference
      };
    }

    return {
      status: '',
      ref: this.allReference
    };
  };

  setFormField = (field, value) => {
    this.props.dispatch(change(ESTIMATES_FORM, field, value));
  };

  onResetFilter = () => {
    const {search} = this.state;
    const {status, ref} = this.getActiveTab();

    ref?.getItems?.({
      queryString: {status, search},
      resetQueryString: true,
      resetParams: true,
      showLoader: true
    });
  };

  changeTabBasedOnFilterStatusSelection = status => {
    if (status === ESTIMATES_TABS.SENT) {
      return {
        activeTab: ESTIMATES_TABS.SENT,
        ref: this.sentReference
      };
    }

    if (status === ESTIMATES_TABS.DRAFT) {
      return {
        activeTab: ESTIMATES_TABS.DRAFT,
        ref: this.draftReference
      };
    }

    return {
      activeTab: ESTIMATES_TABS.ALL,
      ref: this.allReference
    };
  };

  onSubmitFilter = ({
    filterStatus = '',
    from_date = '',
    to_date = '',
    estimate_number = '',
    customer_id = ''
  }) => {
    const {search} = this.state;

    const {activeTab, ref} = this.changeTabBasedOnFilterStatusSelection(
      filterStatus
    );

    this.setState({activeTab});

    ref?.getItems?.({
      queryString: {
        status: filterStatus,
        search,
        customer_id,
        estimate_number,
        from_date,
        to_date
      },
      showLoader: true
    });
  };

  onAddEstimate = () => {
    const {navigation} = this.props;
    navigation.navigate(routes.CREATE_ESTIMATE, {type: 'ADD'});
  };

  getEmptyContentProps = activeTab => {
    const {formValues} = this.props;
    const {search} = this.state;
    const isFilter = isFilterApply(formValues);
    let type = '';

    if (activeTab === ESTIMATES_TABS.DRAFT) {
      type = 'draft';
    } else if (activeTab === ESTIMATES_TABS.SENT) {
      type = 'sent';
    } else {
      type = 'all';
    }

    const emptyTitle = search
      ? 'search.noResult'
      : isFilter
      ? 'filter.empty.filterTitle'
      : `estimates.empty.${type}.title`;

    return {
      title: t(emptyTitle, {search}),
      image: AssetImage.images.empty_estimates,
      ...(!search && {
        description: t(`estimates.empty.${type}.description`)
      }),
      ...(!search &&
        !isFilter && {
          buttonTitle: t('estimates.empty.buttonTitle'),
          buttonPress: () => this.onAddEstimate()
        })
    };
  };

  render() {
    const {navigation, handleSubmit, theme, route} = this.props;

    const {activeTab} = this.state;

    const headerProps = {
      title: t('header.estimates'),
      leftIcon: ARROW_ICON,
      leftIconPress: () => navigation.navigate(routes.MAIN_MORE),
      placement: 'center',
      rightIcon: 'plus',
      route,
      rightIconPress: () => {
        this.onAddEstimate();
      }
    };

    const filterProps = {
      onSubmitFilter: handleSubmit(this.onSubmitFilter),
      ...estimateFilterFields(this),
      clearFilter: this.props,
      onResetFilter: () => this.onResetFilter()
    };

    const tabs = [
      {
        Title: ESTIMATES_TABS.DRAFT,
        tabName: TAB_NAME.DRAFT,
        render: (
          <Draft
            parentProps={this}
            reference={ref => (this.draftReference = ref)}
          />
        )
      },
      {
        Title: ESTIMATES_TABS.SENT,
        tabName: TAB_NAME.SENT,
        render: (
          <Sent
            parentProps={this}
            reference={ref => (this.sentReference = ref)}
          />
        )
      },
      {
        Title: ESTIMATES_TABS.ALL,
        tabName: TAB_NAME.ALL,
        render: (
          <All
            parentProps={this}
            reference={ref => (this.allReference = ref)}
          />
        )
      }
    ];

    return (
      <MainLayout
        headerProps={headerProps}
        onSearch={this.onSearch}
        filterProps={filterProps}
      >
        <Tabs
          style={styles.tabs(theme)}
          activeTab={activeTab}
          setActiveTab={this.setActiveTab}
          tabs={tabs}
          theme={theme}
        />
      </MainLayout>
    );
  }
}
