import TopNav from '../../components/client/dashboardTopNav';
import SideNav from '../../components/client/dashboardSideNav';
import { connect } from 'react-redux';
import SVGs from '../../files/svgs';
import React, { useState, useEffect, useRef } from 'react';
import withUser from '../withUser';
import axios from 'axios';
import { useRouter } from 'next/router';

//// TABLE
import Table from '../../components/table';
import TableAlt from '../../components/tableAlt';
import { tableData, searchData, resetTableData, buildHeaders } from '../../helpers/tableData';
import {
  slabSort,
  productSort,
  remnantSort,
  materialSort,
  priceSort,
  quoteSort,
  jobSort,
  assigneeSort,
  activitySort,
  activityStatusSort,
  activitySetSort,
  purchaseOrderSort,
  jobIssueSort,
  contractSort,
  accountSort,
  contactSort,
  edgeSort
} from '../../helpers/sorts';
import { editData, populateEditData } from '../../helpers/modals';

//// DATA
import { getToken } from '../../helpers/auth';
import _ from 'lodash';

//// FORMS
import SlabForm from '../../components/forms/slabForm';
import ProductForm from '../../components/forms/productForm';
import RemnantForm from '../../components/forms/remnantForm';
import QuoteForm from '../../components/forms/quoteForm';
import JobForm from '../../components/forms/jobForm';
import PurchaseOrderForm from '../../components/forms/purchaseOrderForm';
import ContractForm from '../../components/forms/contractForm';
import AccountForm from '../../components/forms/accountForm'

import {
  submitCreate,
  submitUpdate,
  submitDeleteFile,
  submitDeleteRow,
  submitSearch,
  resetDataType,
} from '../../helpers/forms';

//// VALIDATIONS
import {
  validateNumber,
  validateSize,
  validatePrice,
  validateDate,
  generateQR,
  multipleFiles,
  dateNow,
  phoneNumber,
  addressSelect,
} from '../../helpers/validations';

//// MODALS
import MaterialModal from '../../components/modals/Material';
import ColorModal from '../../components/modals/Color';
import SupplierModal from '../../components/modals/Supplier';
import LocationModal from '../../components/modals/Location';
import BrandModal from '../../components/modals/Brand';
import ModelModal from '../../components/modals/Model';
import CategoryModal from '../../components/modals/Category';
import QuoteLineModal from '../../components/modals/QuoteLine';
import PrintModal from '../../components/modals/Print';
import EmailModal from '../../components/modals/Email';
import PhaseModal from '../../components/modals/Phase';
import QuoteModal from '../../components/modals/Quote';
import PriceListModal from '../../components/modals/PriceList';
import ContactModal from '../../components/modals/Contact';
import AssigneeModal from '../../components/modals/Assignee';
import ActivityModal from '../../components/modals/Activity';
import DependencyModal from '../../components/modals/Dependency';
import ActivityStatusModal from '../../components/modals/ActivityStatus';
import ActivitySetModal from '../../components/modals/ActivitySet';
import ActivityListModal from '../../components/modals/ActivityList';
import PurchaseOrderModal from '../../components/modals/PurchaseOrder';
import PurchaseOrderListModal from '../../components/modals/PurchaseList';
import JobIssueModal from '../../components/modals/JobIssue';
import AccountsModal from '../../components/modals/Accounts';
import PriceListItemsModal from '../../components/modals/PriceListItems'
import JobListItemsModal from '../../components/modals/Job'
import ContactListItemsModal from '../../components/modals/ContactsListItems'
import EdgeModal from '../../components/modals/Edge'
import CutoutModal from '../../components/modals/Cutouts'
import PurchaseOrderLinesModal from '../../components/modals/PurchaseOrderLines'
import ReceivePurchaseOrdersModal from '../../components/modals/ReceivePurchaseOrders'

axios.defaults.withCredentials = true;

const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const Dashboard = ({
  nav,
  account,
  token,
  data,
  originalData,
  params,

  //// REDUX
  hideSideNav,
  showSideNav,
  changeView,
  slab,
  material,
  color,
  supplier,
  location,
  product,
  brand,
  model,
  category,
  remnant,
  priceList,
  contact,
  quote,
  quoteLine,
  phase,
  job,
  assignee,
  activity,
  dependency,
  activityStatus,
  activitySet,
  purchaseOrder,
  contract,
  jobIssue,
  edge,
  cutout,
  email,
  POLine,
  accountItem,
  
  // DISPATCH
  createType,
  resetType,
  addImages,
}) => {
  const myRefs = useRef(null);
  // console.log(originalData)

  const router = useRouter();

  ///// STATE MANAGEMENT
  const [width, setWidth] = useState();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState('');
  const [search, setSearch] = useState('');
  const [selectID, setSelectID] = useState('');
  const [controls, setControls] = useState('');
  const [modal, setModal] = useState('');
  const [dynamicSVG, setDynamicSVG] = useState('notification');
  const [edit, setEdit] = useState('');
  const [allData, setAllData] = useState(originalData ? originalData : []);
  const [event, setEvent] = useState('');
  const [edgeHeaders, setEdgeHeaders] = useState([]);
  const [cutoutHeaders, setCutoutHeaders] = useState([]);
  const [modalFormType, setModalFormType] = useState('')
  const [typeForm, setTypeForm] = useState('')
  const [theme, setTheme] = useState('light')

  let html

  if (typeof window !== "undefined") {
    html = document.querySelector('html')
  }

  useEffect(() => {
    html.dataset.theme = `theme-${theme}`;
  }, [theme])

  //// EDIT QUOTE LINE
  const [modalEdit, setModalEdit] = useState('');

  //// EXTRACTING STATE DATA
  const [dynamicType, setDynamicType] = useState('');
  const [dynamicKey, setDynamicKey] = useState('');

  const handleClickOutside = (event) => {
    if (myRefs.current) {
      if (!myRefs.current.contains(event.target)) {
        setInputDropdown('');
      }
    }
  };

  useEffect(() => {
    setMessage(''), setLoading('');
  }, [nav.view]);

  useEffect(() => {
    buildHeaders(setEdgeHeaders, edgeSort, 'edges')
    buildHeaders(setCutoutHeaders, edgeSort, 'cutouts')
    
    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth < 992) hideSideNav();

    function handleResize() {
      if (width) {
        if (width < 992) {
          hideSideNav();
        }
        if (width > 992) {
          showSideNav();
        }
      }
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width]);

  useEffect(() => {

    let timeOutSearch;

    if(search.length > 0){
      timeOutSearch = setTimeout(() => {
        searchData(nav.view, submitSearch, search, setLoading, setMessage, null, null, allData, setAllData, token, setDynamicSVG, changeView, null)
      }, 2000);
    }

    resetTableData(nav.view, resetDataType, search, loading, setLoading, setMessage, null, null, allData, setAllData, token, setDynamicSVG, changeView, null)

    return () => clearTimeout(timeOutSearch);

  }, [search]);

  const resetCheckboxes = () => {
    const els = document.querySelectorAll('.table-rows-checkbox-input');
    els.forEach((el) => {
      el.checked = false;
    });
  };

  useEffect(() => {
    if (params) params.change ? changeView(params.change) : null;
  }, [router.query.change]);

  const extractingStateData = (stateData) => {
    createType(dynamicType, dynamicKey, stateData);
    setControls('');
  };

  useEffect(() => {
    if (edit == 'purchaseOrderForm') {
      setModal(''), changeView('purchaseOrderForm'), setEdit('purchaseOrders');
    }
  }, [edit]);

  return (
    <>
      <TopNav 
        account={account}
        theme={theme}
        setTheme={setTheme}
      >
      </TopNav>
      <div className="clientDashboard">
        <SideNav
          account={account}
          width={width}
          resetType={resetType}
        ></SideNav>

        {/* //// TABLES //// */}
        {nav.view == 'slabs' && (
          <Table
            token={token}
            title={'Slab List'}
            typeOfData={'slabs'}
            componentData={data.slabs}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={slabSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'slabControls'}
            searchEnable={true}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'slab'}
            modalType={''}
            editDataType={{ key: 'slabs', caseType: 'CREATE_SLAB' }}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="slabs/delete-slab"
            searchType={'slabs'}
            searchPlaceholder={'Search by material or color'}
            stateMethod={createType}
          ></Table>
        )}
        {nav.view == 'products' && (
          <Table
            token={token}
            title={'Product List'}
            typeOfData={'products'}
            componentData={data.products}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={productSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'productControls'}
            searchEnable={true}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'product'}
            modalType={''}
            editDataType={{ key: 'products', caseType: 'CREATE_PRODUCT' }}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="products/delete-product"
            searchType={'products'}
            searchPlaceholder={'Search by brand, model, or category'}
            stateMethod={createType}
          ></Table>
        )}
        {nav.view == 'remnants' && (
          <Table
            token={token}
            title={'Remnant List'}
            typeOfData={'remnants'}
            componentData={data.remnants}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={remnantSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'remnantControls'}
            searchEnable={true}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'remnant'}
            modalType={''}
            editDataType={{ key: 'remnants', caseType: 'CREATE_REMNANT' }}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="remnants/delete-remnant"
            searchType={'remnants'}
            searchPlaceholder={'Search by name, material, or color'}
            stateMethod={createType}
          ></Table>
        )}
        {nav.view == 'trackers' && (
          <div className="table-stack">
            <Table
              token={token}
              title={'Slab List'}
              typeOfData={'slabs'}
              componentData={data.slabs}
              allData={allData}
              setAllData={setAllData}
              modal={modal}
              setModal={setModal}
              sortOrder={slabSort}
              selectID={selectID}
              setSelectID={setSelectID}
              controls={controls}
              setControls={setControls}
              controlsType={'slabControls'}
              searchEnable={true}
              search={search}
              setSearch={setSearch}
              message={message}
              setMessage={setMessage}
              resetCheckboxes={resetCheckboxes}
              editData={editData}
              changeView={changeView}
              setEdit={setEdit}
              viewType={'slab'}
              modalType={''}
              editDataType={{ key: 'slabs', caseType: 'CREATE_SLAB' }}
              submitDeleteRow={submitDeleteRow}
              loading={loading}
              setLoading={setLoading}
              dynamicSVG={dynamicSVG}
              setDynamicSVG={setDynamicSVG}
              deleteType="slabs/delete-slab"
              searchType={'slabs'}
              stateMethod={createType}
            ></Table>
            <Table
              token={token}
              title={'Product List'}
              typeOfData={'products'}
              componentData={data.products}
              allData={allData}
              setAllData={setAllData}
              modal={modal}
              setModal={setModal}
              sortOrder={productSort}
              selectID={selectID}
              setSelectID={setSelectID}
              controls={controls}
              setControls={setControls}
              controlsType={'productControls'}
              searchEnable={true}
              search={search}
              setSearch={setSearch}
              message={message}
              setMessage={setMessage}
              resetCheckboxes={resetCheckboxes}
              editData={editData}
              changeView={changeView}
              setEdit={setEdit}
              viewType={'product'}
              modalType={''}
              editDataType={{ key: 'products', caseType: 'CREATE_PRODUCT' }}
              submitDeleteRow={submitDeleteRow}
              loading={loading}
              setLoading={setLoading}
              dynamicSVG={dynamicSVG}
              setDynamicSVG={setDynamicSVG}
              deleteType="products/delete-product"
              searchType={'products'}
              stateMethod={createType}
            ></Table>
          </div>
        )}
        {nav.view == 'activities' && (
          <Table
            token={token}
            title={'Activity Type List'}
            typeOfData={'activities'}
            componentData={data.activities}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={activitySort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'activityControls'}
            searchEnable={false}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'activities'}
            modalType={'activities'}
            editModalType={'activities'}
            editDataType={{ key: 'activities', caseType: 'CREATE_ACTIVITY' }}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="activities/delete-activity"
            searchType={'activities'}
            searchPlaceholder={'Search by activity name'}
            createItem={'activities'}
            createDependency={'activities'}
            stateMethod={createType}
          ></Table>
        )}
        {nav.view == 'quotes' && (
          <Table
            token={token}
            title={'Quote List'}
            typeOfData={'quotes'}
            componentData={data.quotes}
            allData={allData}
            setAllData={setAllData}
            stateMethod={createType}
            modal={modal}
            setModal={setModal}
            sortOrder={quoteSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'quoteControls'}
            searchEnable={true}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'quote'}
            modalType={''}
            editDataType={{ key: 'quotes', caseType: 'CREATE_QUOTE' }}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="quotes/delete-quote"
            searchType={'quotes'}
            searchPlaceholder={'Search by quote number or quote name'}
          ></Table>
        )}
        {nav.view == 'jobIssues' && (
          <Table
            token={token}
            title={'Job Issues'}
            typeOfData={'jobIssues'}
            componentData={data.jobIssues}
            allData={allData}
            setAllData={setAllData}
            stateMethod={createType}
            modal={modal}
            setModal={setModal}
            sortOrder={jobIssueSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'jobIssueControls'}
            searchEnable={false}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'jobIssues'}
            modalType={'jobIssue'}
            editDataType={{ key: 'jobIssues', caseType: 'CREATE_JOB_ISSUE' }}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="job-issue/delete-job-issue"
            searchType={'jobsIssues'}
            searchPlaceholder={'Search by job name'}
            typeOfDataParent={'jobs'}
          ></Table>
        )}

        {nav.view == 'contracts' && (
          <Table
            token={token}
            title={'Contracts'}
            typeOfData={'contracts'}
            componentData={data.contracts}
            allData={allData}
            setAllData={setAllData}
            stateMethod={createType}
            modal={modal}
            setModal={setModal}
            sortOrder={contractSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'contractControls'}
            searchEnable={false}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'contractForm'}
            modalType={''}
            editDataType={{ key: 'contracts', caseType: 'CREATE_CONTRACT' }}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="contracts/delete-contract"
            searchType={'contracts'}
            searchPlaceholder={'Search by job name'}
          ></Table>
        )}
        {nav.view == 'accounts' && (
          <Table
            token={token}
            title={'Accounts List'}
            typeOfData={'accounts'}
            componentData={data.accounts}
            allData={allData}
            setAllData={setAllData}
            stateMethod={createType}
            modal={modal}
            setModal={setModal}
            sortOrder={accountSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'accountControls'}
            searchEnable={false}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'accountForm'}
            modalType={''}
            editDataType={{ key: 'accounts', caseType: 'CREATE_ACCOUNT' }}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="accounts/delete-account"
            searchType={'accounts'}
            searchPlaceholder={'Search by account by name or account number'}
          ></Table>
        )}
        {nav.view == 'jobs' && (
          <Table
            token={token}
            title={'Job List'}
            typeOfData={'jobs'}
            componentData={data.jobs}
            allData={allData}
            setAllData={setAllData}
            stateMethod={createType}
            modal={modal}
            setModal={setModal}
            sortOrder={jobSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'jobControls'}
            searchEnable={true}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'job'}
            modalType={''}
            editDataType={{ key: 'jobs', caseType: 'CREATE_JOB' }}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="jobs/delete-job"
            searchType={'jobs'}
            searchPlaceholder={'Search by job name or quote number'}
          ></Table>
        )}
        {nav.view == 'activitySets' && (
          <Table
            token={token}
            title={'Activity Set List'}
            typeOfData={'activitySets'}
            componentData={data.activitySets}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={activitySetSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'activitySetControls'}
            searchEnable={false}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'activitySets'}
            modalType={'activitySet'}
            editModalType={'activitySet'}
            editDataType={{
              key: 'activitySets',
              caseType: 'CREATE_ACTIVITY_SET',
            }}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="activities/delete-activity-set"
            searchType={'activitySets'}
            searchPlaceholder={'Search by activity set name'}
            createItem={'activitySets'}
            stateMethod={createType}
          ></Table>
        )}


        {/* ALTERNATIVE TABLES */}


        {nav.view == 'materials' && (
          <TableAlt
            token={token}
            title={'Material List'}
            typeOfData={'materials'}
            componentData={data.materials}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={materialSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'materialControls'}
            searchEnable={false}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'materials'}
            modalType={'add_material'}
            editModalType={'material'}
            editDataType={{ key: 'materials', caseType: 'CREATE_MATERIAL' }}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="materials/delete-material"
            searchType={'materials'}
            searchPlaceholder={'Search by name'}
            setDynamicType={setDynamicType}
            setDynamicKey={setDynamicKey}
            stateMethod={createType}
          ></TableAlt>
        )}
        {nav.view == 'colors' && (
          <TableAlt
            token={token}
            title={'Color List'}
            typeOfData={'colors'}
            componentData={data.colors}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={materialSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'colorControls'}
            searchEnable={false}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'colors'}
            modalType={'add_color'}
            editModalType={'color'}
            editDataType={{ key: 'colors', caseType: 'CREATE_COLOR' }}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="colors/delete-color"
            searchType={'colors'}
            searchPlaceholder={'Search by name'}
            setDynamicType={setDynamicType}
            setDynamicKey={setDynamicKey}
            stateMethod={createType}
          ></TableAlt>
        )}
        {nav.view == 'suppliers' && (
          <TableAlt
            token={token}
            title={'Supplier List'}
            typeOfData={'suppliers'}
            componentData={data.suppliers}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={materialSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'supplierControls'}
            searchEnable={false}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'suppliers'}
            modalType={'add_supplier'}
            editModalType={'supplier'}
            editDataType={{ key: 'suppliers', caseType: 'CREATE_SUPPLIER' }}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="suppliers/delete-supplier"
            searchType={'suppliers'}
            searchPlaceholder={'Search by name'}
            setDynamicType={setDynamicType}
            setDynamicKey={setDynamicKey}
            stateMethod={createType}
          ></TableAlt>
        )}
        {nav.view == 'locations' && (
          <TableAlt
            token={token}
            title={'Location List'}
            typeOfData={'locations'}
            componentData={data.locations}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={materialSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'locationControls'}
            searchEnable={false}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'locations'}
            modalType={'add_location'}
            editModalType={'location'}
            editDataType={{ key: 'locations', caseType: 'CREATE_LOCATION' }}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="locations/delete-location"
            searchType={'locations'}
            searchPlaceholder={'Search by name'}
            setDynamicType={setDynamicType}
            setDynamicKey={setDynamicKey}
            stateMethod={createType}
          ></TableAlt>
        )}
        {nav.view == 'brands' && (
          <TableAlt
            token={token}
            title={'Brand List'}
            typeOfData={'brands'}
            componentData={data.brands}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={materialSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'brandControls'}
            searchEnable={false}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'brands'}
            modalType={'add_brand'}
            editModalType={'brand'}
            editDataType={{ key: 'brands', caseType: 'CREATE_BRAND' }}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="brands/delete-brand"
            searchType={'brands'}
            searchPlaceholder={'Search by name'}
            setDynamicType={setDynamicType}
            setDynamicKey={setDynamicKey}
            stateMethod={createType}
          ></TableAlt>
        )}
        {nav.view == 'categories' && (
          <TableAlt
            token={token}
            title={'Category List'}
            typeOfData={'categories'}
            componentData={data.categories}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={materialSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'categoryControls'}
            searchEnable={false}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'categories'}
            modalType={'add_category'}
            editModalType={'category'}
            editDataType={{ key: 'categories', caseType: 'CREATE_CATEGORY' }}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="categories/delete-category"
            searchType={'categories'}
            searchPlaceholder={'Search by name'}
            setDynamicType={setDynamicType}
            setDynamicKey={setDynamicKey}
            stateMethod={createType}
          ></TableAlt>
        )}
        {nav.view == 'models' && (
          <TableAlt
            token={token}
            title={'Model List'}
            typeOfData={'models'}
            componentData={data.models}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={materialSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'modelControls'}
            searchEnable={false}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'models'}
            modalType={'add_model'}
            editModalType={'model'}
            editDataType={{ key: 'models', caseType: 'CREATE_MODEL' }}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="models/delete-model"
            searchType={'models'}
            searchPlaceholder={'Search by name'}
            setDynamicType={setDynamicType}
            setDynamicKey={setDynamicKey}
            stateMethod={createType}
          ></TableAlt>
        )}
        {nav.view == 'prices' && (
          <TableAlt
            token={token}
            title={'Price List'}
            typeOfData={'prices'}
            componentData={data.prices}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={priceSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'modelControls'}
            searchEnable={false}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'prices'}
            modalType={'new_price_list'}
            editModalType={'price_list'}
            editDataType={{ key: 'prices', caseType: 'CREATE_PRICE_LIST' }}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="price/delete-price"
            searchType={'prices'}
            searchPlaceholder={'Search by name'}
            setDynamicType={setDynamicType}
            setDynamicKey={setDynamicKey}
            stateMethod={createType}
          ></TableAlt>
        )}
        {nav.view == 'contacts' && (
          <TableAlt
            token={token}
            title={'Contact List'}
            typeOfData={'contacts'}
            componentData={data.contacts}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={contactSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'modelControls'}
            searchEnable={false}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'contacts'}
            modalType={'new_contact'}
            editModalType={'contact'}
            editDataType={{ key: 'contacts', caseType: 'CREATE_CONTACT' }}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="contact/delete-contact"
            searchType={'contacts'}
            searchPlaceholder={'Search by contact name'}
            setDynamicType={setDynamicType}
            setDynamicKey={setDynamicKey}
            stateMethod={createType}
          ></TableAlt>
        )}
        {nav.view == 'phases' && (
          <TableAlt
            token={token}
            title={'Phase List'}
            typeOfData={'phases'}
            componentData={data.phases}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={materialSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'phaseControls'}
            searchEnable={false}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'phases'}
            modalType={'phase'}
            editModalType={'phase'}
            editDataType={{ key: 'phases', caseType: 'CREATE_PHASE' }}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="phases/delete-phase"
            searchType={'phases'}
            searchPlaceholder={'Search by phase name'}
            setDynamicType={setDynamicType}
            setDynamicKey={setDynamicKey}
            stateMethod={createType}
          ></TableAlt>
        )}
        {nav.view == 'assignees' && (
          <TableAlt
            token={token}
            title={'Assignee List'}
            typeOfData={'assignees'}
            componentData={data.assignees}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={assigneeSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'assigneeControls'}
            searchEnable={false}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'assignees'}
            modalType={'assignee'}
            editModalType={'assignees'}
            editDataType={{ key: 'assignees', caseType: 'CREATE_ASSIGNEE' }}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="assignee/delete-assignee"
            searchType={'assignees'}
            searchPlaceholder={'Search by assignee name'}
            setDynamicType={setDynamicType}
            setDynamicKey={setDynamicKey}
            stateMethod={createType}
          ></TableAlt>
        )}
        {nav.view == 'activityStatus' && (
          <TableAlt
            token={token}
            title={'Activity Status List'}
            typeOfData={'activityStatus'}
            componentData={data.activityStatus}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={activityStatusSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'activityStatusControls'}
            searchEnable={false}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'activityStatus'}
            modalType={'activityStatus'}
            editModalType={'activityStatus'}
            editDataType={{
              key: 'activityStatus',
              caseType: 'CREATE_ACTIVITY_STATUS',
            }}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="activities/delete-activity-status"
            searchType={'activityStatus'}
            searchPlaceholder={'Search by activity status'}
            setDynamicType={setDynamicType}
            setDynamicKey={setDynamicKey}
            stateMethod={createType}
          ></TableAlt>
        )}
        {nav.view == 'purchaseOrders' && (
          <TableAlt
            token={token}
            title={'Purchase Order List'}
            typeOfData={'purchaseOrders'}
            componentData={data.purchaseOrders}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={purchaseOrderSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'modelControls'}
            searchEnable={false}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'purchaseOrders'}
            modalType={'purchaseOrders'}
            editModalType={'purchaseOrderForm'}
            editDataType={{ key: 'purchaseOrders', caseType: 'CREATE_PO' }}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="purchase-order/delete-purchase-order"
            searchType={'purchaseOrders'}
            searchPlaceholder={'Search by supplier'}
            setDynamicType={setDynamicType}
            setDynamicKey={setDynamicKey}
            stateMethod={createType}
          ></TableAlt>
        )}
        {nav.view == 'edges' && (
          <TableAlt
            token={token}
            title={'Edge List'}
            typeOfData={'edges'}
            componentData={edgeHeaders}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={edgeSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'edgeControls'}
            searchEnable={false}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'edges'}
            modalType={'add_edge'}
            editModalType={'edge'}
            editDataType={{ key: 'edges', caseType: 'CREATE_EDGE' }}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="edges/delete-edge"
            searchType={'edges'}
            searchPlaceholder={'Search by name'}
            setDynamicType={setDynamicType}
            setDynamicKey={setDynamicKey}
            stateMethod={createType}
          ></TableAlt>
        )}
        {nav.view == 'cutouts' && (
          <TableAlt
            token={token}
            title={'Cutouts List'}
            typeOfData={'cutouts'}
            componentData={cutoutHeaders}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={edgeSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'cutoutControls'}
            searchEnable={false}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'cutouts'}
            modalType={'add_cutout'}
            editModalType={'cutout'}
            editDataType={{ key: 'cutouts', caseType: 'CREATE_CUTOUT' }}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="cutouts/delete-cutout"
            searchType={'cutouts'}
            searchPlaceholder={'Search by name'}
            setDynamicType={setDynamicType}
            setDynamicKey={setDynamicKey}
            stateMethod={createType}
          ></TableAlt>
        )}



        {/* ///// FORMS //// */}


        {nav.view == 'slab' && (
          <SlabForm
            token={token}
            title={'New Slab'}
            typeOfData={'slabs'}
            allData={allData}
            setAllData={setAllData}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            submitCreate={submitCreate}
            modal={modal}
            setModal={setModal}
            stateData={slab}
            stateMethod={createType}
            originalData={originalData}
            message={message}
            setMessage={setMessage}
            loading={loading}
            setLoading={setLoading}
            validateNumber={validateNumber}
            validatePrice={validatePrice}
            validateDate={validateDate}
            generateQR={generateQR}
            resetState={resetType}
            addImages={addImages}
            dateNow={dateNow}
            edit={edit}
            setEdit={setEdit}
            submitUpdate={submitUpdate}
            changeView={changeView}
            submitDeleteFile={submitDeleteFile}
            editData={editData}
          ></SlabForm>
        )}

        {nav.view == 'product' && (
          <ProductForm
            token={token}
            title={'New Product'}
            typeOfData={'products'}
            allData={allData}
            setAllData={setAllData}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            submitCreate={submitCreate}
            modal={modal}
            setModal={setModal}
            stateData={product}
            stateMethod={createType}
            originalData={originalData}
            message={message}
            setMessage={setMessage}
            loading={loading}
            setLoading={setLoading}
            validateNumber={validateNumber}
            validatePrice={validatePrice}
            validateDate={validateDate}
            generateQR={generateQR}
            resetState={resetType}
            addImages={addImages}
            multipleFiles={multipleFiles}
            dateNow={dateNow}
            edit={edit}
            setEdit={setEdit}
            submitUpdate={submitUpdate}
            changeView={changeView}
            submitDeleteFile={submitDeleteFile}
            editData={editData}
          ></ProductForm>
        )}

        {nav.view == 'remnant' && (
          <RemnantForm
            token={token}
            title={'New Remnant'}
            typeOfData={'remnants'}
            allData={allData}
            setAllData={setAllData}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            submitCreate={submitCreate}
            modal={modal}
            setModal={setModal}
            stateData={remnant}
            stateMethod={createType}
            originalData={originalData}
            message={message}
            setMessage={setMessage}
            loading={loading}
            setLoading={setLoading}
            validateNumber={validateNumber}
            validateSize={validateSize}
            validatePrice={validatePrice}
            validateDate={validateDate}
            generateQR={generateQR}
            resetState={resetType}
            addImages={addImages}
            multipleFiles={multipleFiles}
            dateNow={dateNow}
            edit={edit}
            setEdit={setEdit}
            submitUpdate={submitUpdate}
            changeView={changeView}
            submitDeleteFile={submitDeleteFile}
            editData={editData}
          ></RemnantForm>
        )}

        {nav.view == 'quote' && (
          <QuoteForm
            token={token}
            account={account}
            title={'New Quote'}
            typeOfData={'quotes'}
            allData={allData}
            setAllData={setAllData}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            submitCreate={submitCreate}
            modal={modal}
            setModal={setModal}
            setModalEdit={setModalEdit}
            stateData={quote}
            stateMethod={createType}
            originalData={originalData}
            message={message}
            setMessage={setMessage}
            loading={loading}
            setLoading={setLoading}
            resetState={resetType}
            edit={edit}
            setEdit={setEdit}
            submitUpdate={submitUpdate}
            changeView={changeView}
            editData={editData}
            submitDeleteRow={submitDeleteRow}
            deleteType="quotes/delete-quote"
            resetCheckboxes={resetCheckboxes}
            setControls={setControls}
            typeOfDataParent={'jobs'}
            secondStateData={job}
            setSelectID={setSelectID}
          ></QuoteForm>
        )}

        {nav.view == 'job' && (
          <JobForm
            token={token}
            account={account}
            title={'New Job'}
            typeOfData={'jobs'}
            componentData={data.jobs}
            allData={allData}
            setAllData={setAllData}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            submitCreate={submitCreate}
            modal={modal}
            setModal={setModal}
            setModalEdit={setModalEdit}
            stateData={job}
            stateMethod={createType}
            originalData={originalData}
            message={message}
            setMessage={setMessage}
            loading={loading}
            setLoading={setLoading}
            resetState={resetType}
            edit={edit}
            setEdit={setEdit}
            submitUpdate={submitUpdate}
            changeView={changeView}
            editData={editData}
            selectID={selectID}
            setSelectID={setSelectID}
            setDynamicType={setDynamicType}
            setDynamicKey={setDynamicKey}
            controls={controls}
            setControls={setControls}
            resetCheckboxes={resetCheckboxes}
            extractingStateData={extractingStateData}
            addImages={addImages}
            submitDeleteFile={submitDeleteFile}
            event={event}
            setEvent={setEvent}
            setTypeForm={setTypeForm}
          ></JobForm>
        )}

        {nav.view == 'purchaseOrderForm' && (
          <PurchaseOrderForm
            token={token}
            title={'Purchase Order'}
            typeOfData={'purchaseOrders'}
            allData={allData}
            setAllData={setAllData}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            submitCreate={submitCreate}
            modal={modal}
            setModal={setModal}
            stateData={purchaseOrder}
            stateMethod={createType}
            originalData={originalData}
            message={message}
            setMessage={setMessage}
            loading={loading}
            setLoading={setLoading}
            validateNumber={validateNumber}
            validatePrice={validatePrice}
            validateDate={validateDate}
            generateQR={generateQR}
            resetState={resetType}
            addImages={addImages}
            dateNow={dateNow}
            edit={edit}
            setEdit={setEdit}
            submitUpdate={submitUpdate}
            changeView={changeView}
            submitDeleteFile={submitDeleteFile}
            editData={editData}
            controls={controls}
            setControls={setControls}
            resetCheckboxes={resetCheckboxes}
            extractingStateData={extractingStateData}
            setDynamicType={setDynamicType}
            setDynamicKey={setDynamicKey}
            selectID={selectID}
            setSelectID={setSelectID}
            setModalFormType={setModalFormType}
            typeForm={typeForm}
            setTypeForm={setTypeForm}
          ></PurchaseOrderForm>
        )}

        {nav.view == 'contractForm' && (
          <ContractForm
            token={token}
            title={'New Contract'}
            typeOfData={'contracts'}
            allData={allData}
            setAllData={setAllData}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            submitCreate={submitCreate}
            modal={modal}
            setModal={setModal}
            stateData={contract}
            stateMethod={createType}
            originalData={originalData}
            message={message}
            setMessage={setMessage}
            loading={loading}
            setLoading={setLoading}
            validateNumber={validateNumber}
            validatePrice={validatePrice}
            validateDate={validateDate}
            generateQR={generateQR}
            resetState={resetType}
            addImages={addImages}
            dateNow={dateNow}
            edit={edit}
            setEdit={setEdit}
            submitUpdate={submitUpdate}
            changeView={changeView}
            submitDeleteFile={submitDeleteFile}
            editData={editData}
            setSelectID={setSelectID}
          ></ContractForm>
        )}

        {nav.view == 'accountForm' && (
          <AccountForm
            token={token}
            account={account}
            title={'New Account'}
            typeOfData={'accounts'}
            componentData={data.accounts}
            allData={allData}
            setAllData={setAllData}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            submitCreate={submitCreate}
            modal={modal}
            setModal={setModal}
            setModalEdit={setModalEdit}
            stateData={accountItem}
            stateMethod={createType}
            originalData={originalData}
            message={message}
            setMessage={setMessage}
            loading={loading}
            setLoading={setLoading}
            resetState={resetType}
            edit={edit}
            setEdit={setEdit}
            submitUpdate={submitUpdate}
            changeView={changeView}
            editData={editData}
            selectID={selectID}
            setSelectID={setSelectID}
            setDynamicType={setDynamicType}
            setDynamicKey={setDynamicKey}
            controls={controls}
            setControls={setControls}
            resetCheckboxes={resetCheckboxes}
            extractingStateData={extractingStateData}
            addImages={addImages}
            submitDeleteFile={submitDeleteFile}
            event={event}
            setEvent={setEvent}
            setTypeForm={setTypeForm}
          ></AccountForm>
        )}

        <div className="clientDashboard-view">
          {nav.view == 'main' && (
            <div className="clientDashboard-view-main">
              <div className="clientDashboard-view-main-box"></div>
              <div className="clientDashboard-view-main-box"></div>
              <div className="clientDashboard-view-main-box"></div>
              <div className="clientDashboard-view-main-box"></div>
            </div>
          )}
          {nav.view == 'new' && (
            <div className="clientDashboard-view-new">
              <div
                className="clientDashboard-view-new-item"
                onClick={() => (
                  setEdit(''), changeView('slab'), resetType('RESET_SLAB')
                )}
              >
                <SVGs svg={'slab'}></SVGs>
                <span>New Slab</span>
              </div>
              <div
                className="clientDashboard-view-new-item"
                onClick={() => (
                  setEdit(''), changeView('product'), resetType('RESET_PRODUCT')
                )}
              >
                <SVGs svg={'box'}></SVGs>
                <span>New Product</span>
              </div>
              <div
                className="clientDashboard-view-new-item"
                onClick={() => (
                  setEdit(''), changeView('remnant'), resetType('RESET_REMNANT')
                )}
              >
                <SVGs svg={'remnant'}></SVGs>
                <span>New Remnant</span>
              </div>
              <div
                className="clientDashboard-view-new-item"
                onClick={() => (
                  setEdit(''),
                  changeView('materials'),
                  resetType('RESET_MATERIAL')
                )}
              >
                <SVGs svg={'materials'}></SVGs>
                <span>Materials</span>
              </div>
              <div
                className="clientDashboard-view-new-item"
                onClick={() => (
                  setEdit(''), changeView('colors'), resetType('RESET_COLOR')
                )}
              >
                <SVGs svg={'colors'}></SVGs>
                <span>Colors</span>
              </div>
              <div
                className="clientDashboard-view-new-item"
                onClick={() => (
                  setEdit(''),
                  changeView('suppliers'),
                  resetType('RESET_SUPPLIER')
                )}
              >
                <SVGs svg={'supplier'}></SVGs>
                <span>Suppliers</span>
              </div>
              <div
                className="clientDashboard-view-new-item"
                onClick={() => (
                  setEdit(''),
                  changeView('locations'),
                  resetType('RESET_LOCATION')
                )}
              >
                <SVGs svg={'location'}></SVGs>
                <span>Locations</span>
              </div>
              <div
                className="clientDashboard-view-new-item"
                onClick={() => (
                  setEdit(''), changeView('brands'), resetType('RESET_BRAND')
                )}
              >
                <SVGs svg={'brand'}></SVGs>
                <span>Brands</span>
              </div>
              <div
                className="clientDashboard-view-new-item"
                onClick={() => (
                  setEdit(''),
                  changeView('categories'),
                  resetType('RESET_CATEGORY')
                )}
              >
                <SVGs svg={'category'}></SVGs>
                <span>Categories</span>
              </div>
              <div
                className="clientDashboard-view-new-item"
                onClick={() => (
                  setEdit(''), changeView('models'), resetType('RESET_MODEL')
                )}
              >
                <SVGs svg={'model'}></SVGs>
                <span>Model</span>
              </div>
              <div
                className="clientDashboard-view-new-item"
                onClick={() => (
                  setEdit(''), changeView('edges'), resetType('RESET_EDGE')
                )}
              >
                <SVGs svg={'edge'}></SVGs>
                <span>Edge</span>
              </div>
              <div
                className="clientDashboard-view-new-item"
                onClick={() => (
                  setEdit(''), changeView('cutouts'), resetType('RESET_CUTOUT')
                )}
              >
                <SVGs svg={'cutouts'}></SVGs>
                <span>Cutouts</span>
              </div>
            </div>
          )}
          {nav.view == 'transaction-new' && (
            <div className="clientDashboard-view-new">
              <div
                className="clientDashboard-view-new-item"
                onClick={() => (
                  setEdit(''), changeView('accountForm'), resetType('RESET_ACCOUNT')
                )}
              >
                <SVGs svg={'account'}></SVGs>
                <span>New Account</span>
              </div>
              <div
                className="clientDashboard-view-new-item"
                onClick={() => (
                  setEdit(''), changeView('quote'), resetType('RESET_QUOTE')
                )}
              >
                <SVGs svg={'document'}></SVGs>
                <span>New Quote</span>
              </div>
              <div
                className="clientDashboard-view-new-item"
                onClick={() => (
                  setEdit(''), changeView('job'), resetType('RESET_JOB')
                )}
              >
                <SVGs svg={'job'}></SVGs>
                <span>New Job</span>
              </div>
              <div
                className="clientDashboard-view-new-item"
                onClick={() => (
                  setEdit(''),
                  changeView('contractForm'),
                  resetType('RESET_CONTRACT')
                )}
              >
                <SVGs svg={'files'}></SVGs>
                <span>New Contract</span>
              </div>
              <div
                className="clientDashboard-view-new-item"
                onClick={() => changeView('prices')}
              >
                <SVGs svg={'price-list'}></SVGs>
                <span>Price List</span>
              </div>
              <div
                className="clientDashboard-view-new-item"
                onClick={() => changeView('contacts')}
              >
                <SVGs svg={'location'}></SVGs>
                <span>Contacts</span>
              </div>
              <div
                className="clientDashboard-view-new-item"
                onClick={() => changeView('phases')}
              >
                <SVGs svg={'clipboard'}></SVGs>
                <span>Phase/Category</span>
              </div>
              <div
                className="clientDashboard-view-new-item"
                onClick={() => changeView('assignees')}
              >
                <SVGs svg={'user'}></SVGs>
                <span>Assignee</span>
              </div>
              <div
                className="clientDashboard-view-new-item"
                onClick={() => changeView('activities')}
              >
                <SVGs svg={'activity'}></SVGs>
                <span>Activity Types</span>
              </div>
              <div
                className="clientDashboard-view-new-item"
                onClick={() => changeView('activityStatus')}
              >
                <SVGs svg={'hour-glass'}></SVGs>
                <span>Activity Status</span>
              </div>
              <div
                className="clientDashboard-view-new-item"
                onClick={() => changeView('activitySets')}
              >
                <SVGs svg={'stack'}></SVGs>
                <span>Activity Sets</span>
              </div>
              <div
                className="clientDashboard-view-new-item"
                onClick={() => (
                  setEdit(''), setModal('purchaseOrders'), resetType('RESET_PO')
                )}
              >
                <SVGs svg={'cart'}></SVGs>
                <span>Purchase Orders</span>
              </div>
            </div>
          )}
        </div>

        {/* /////////////////// MODALS ///////////////////////////// */}

        {modal == 'add_material' && (
          <MaterialModal
            token={token}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            stateData={material}
            stateMethod={createType}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            allData={allData}
            setAllData={setAllData}
            submitUpdate={submitUpdate}
            changeView={changeView}
          ></MaterialModal>
        )}
        {modal == 'add_color' && (
          <ColorModal
            token={token}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            stateData={color}
            stateMethod={createType}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            allData={allData}
            setAllData={setAllData}
            submitUpdate={submitUpdate}
            changeView={changeView}
          ></ColorModal>
        )}
        {modal == 'add_supplier' && (
          <SupplierModal
            token={token}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            stateData={supplier}
            stateMethod={createType}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            allData={allData}
            setAllData={setAllData}
            validateNumber={validateNumber}
            phoneNumber={phoneNumber}
            addressSelect={addressSelect}
            submitUpdate={submitUpdate}
            changeView={changeView}
          ></SupplierModal>
        )}
        {modal == 'add_location' && (
          <LocationModal
            token={token}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            stateData={location}
            stateMethod={createType}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            allData={allData}
            setAllData={setAllData}
            submitUpdate={submitUpdate}
            changeView={changeView}
          ></LocationModal>
        )}
        {modal == 'add_brand' && (
          <BrandModal
            token={token}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            stateData={brand}
            stateMethod={createType}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            allData={allData}
            setAllData={setAllData}
            submitUpdate={submitUpdate}
            changeView={changeView}
          ></BrandModal>
        )}
        {modal == 'add_model' && (
          <ModelModal
            token={token}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            stateData={model}
            stateMethod={createType}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            allData={allData}
            setAllData={setAllData}
            submitUpdate={submitUpdate}
            changeView={changeView}
          ></ModelModal>
        )}
        {modal == 'add_category' && (
          <CategoryModal
            token={token}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            stateData={category}
            stateMethod={createType}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            allData={allData}
            setAllData={setAllData}
            submitUpdate={submitUpdate}
            changeView={changeView}
          ></CategoryModal>
        )}
        {modal == 'add_quote_line' && (
          <QuoteLineModal
            token={token}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            modalEdit={modalEdit}
            setModalEdit={setModalEdit}
            stateData={quoteLine}
            stateMethod={createType}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            allData={allData}
            setAllData={setAllData}
            submitUpdate={submitUpdate}
            changeView={changeView}
            typeForm={nav.form}
          ></QuoteLineModal>
        )}
        {modal == 'new_price_list' && (
          <PriceListModal
            token={token}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            stateData={priceList}
            stateMethod={createType}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            addImages={addImages}
            allData={allData}
            setAllData={setAllData}
            submitUpdate={submitUpdate}
            changeView={changeView}
            submitDeleteFile={submitDeleteFile}
            editData={editData}
          ></PriceListModal>
        )}
        {modal == 'new_contact' && (
          <ContactModal
            token={token}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            stateData={contact}
            stateMethod={createType}
            dynamicType={dynamicType}
            extractingStateData={extractingStateData}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            addImages={addImages}
            allData={allData}
            setAllData={setAllData}
            submitUpdate={submitUpdate}
            changeView={changeView}
            submitDeleteFile={submitDeleteFile}
            editData={editData}
          ></ContactModal>
        )}
        {modal == 'new_pdf' && (
          <PrintModal
            token={token}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            stateData={quote}
            typeForm={nav.form}
            stateMethod={createType}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            addImages={addImages}
            allData={allData}
            setAllData={setAllData}
            submitUpdate={submitUpdate}
            changeView={changeView}
            submitDeleteFile={submitDeleteFile}
            editData={editData}
          ></PrintModal>
        )}
        {modal == 'email' && (
          <EmailModal
            token={token}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            stateData={email}
            stateMethod={createType}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            addImages={addImages}
            allData={allData}
            setAllData={setAllData}
            submitUpdate={submitUpdate}
            changeView={changeView}
            editData={editData}
          ></EmailModal>
        )}
        {modal == 'phase' && (
          <PhaseModal
            token={token}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            stateData={phase}
            stateMethod={createType}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            addImages={addImages}
            allData={allData}
            setAllData={setAllData}
            submitUpdate={submitUpdate}
            changeView={changeView}
            editData={editData}
          ></PhaseModal>
        )}
        {modal == 'quote' && (
          <QuoteModal
            token={token}
            account={account}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            stateData={quote}
            stateMethod={createType}
            dynamicType={dynamicType}
            extractingStateData={extractingStateData}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            allData={allData}
            setAllData={setAllData}
            submitUpdate={submitUpdate}
            changeView={changeView}
            editData={editData}
            autoFill={nav.view === 'job' ? job : accountItem}
            autoFillType={'quotes'}
            dataType={'quotes'}
            selectID={selectID}
            typeOfData={nav.view === 'job' ? 'job' : 'accountForm'}
            setEvent={setEvent}
          ></QuoteModal>
        )}
        {modal == 'assignee' && (
          <AssigneeModal
            token={token}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            stateData={assignee}
            stateMethod={createType}
            dynamicType={dynamicType}
            extractingStateData={extractingStateData}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            allData={allData}
            setAllData={setAllData}
            submitUpdate={submitUpdate}
            changeView={changeView}
            editData={editData}
          ></AssigneeModal>
        )}
        {modal == 'activities' && (
          <ActivityModal
            token={token}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            stateData={activity}
            stateMethod={createType}
            dynamicType={dynamicType}
            extractingStateData={extractingStateData}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            allData={allData}
            setAllData={setAllData}
            submitUpdate={submitUpdate}
            changeView={changeView}
            editData={editData}
          ></ActivityModal>
        )}
        {modal == 'dependency' && (
          <DependencyModal
            token={token}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            stateData={dependency}
            stateMethod={createType}
            dynamicType={dynamicType}
            extractingStateData={extractingStateData}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            allData={allData}
            setAllData={setAllData}
            submitUpdate={submitUpdate}
            changeView={changeView}
            editData={editData}
            selectID={selectID}
          ></DependencyModal>
        )}
        {modal == 'activityStatus' && (
          <ActivityStatusModal
            token={token}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            stateData={activityStatus}
            stateMethod={createType}
            dynamicType={dynamicType}
            extractingStateData={extractingStateData}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            allData={allData}
            setAllData={setAllData}
            submitUpdate={submitUpdate}
            changeView={changeView}
            editData={editData}
            selectID={selectID}
          ></ActivityStatusModal>
        )}
        {modal == 'activitySet' && (
          <ActivitySetModal
            token={token}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            stateData={activitySet}
            stateMethod={createType}
            dynamicType={dynamicType}
            extractingStateData={extractingStateData}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            allData={allData}
            setAllData={setAllData}
            submitUpdate={submitUpdate}
            changeView={changeView}
            editData={editData}
            selectID={selectID}
          ></ActivitySetModal>
        )}
        {modal == 'activityList' && (
          <ActivityListModal
            token={token}
            account={account}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            stateData={activity}
            stateMethod={createType}
            dynamicType={dynamicType}
            extractingStateData={extractingStateData}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            allData={allData}
            setAllData={setAllData}
            submitUpdate={submitUpdate}
            changeView={changeView}
            editData={editData}
            autoFill={job}
            autoFillType={'activities'}
            dataType={'activities'}
            selectID={selectID}
            typeOfData={'job'}
            setEvent={setEvent}
          ></ActivityListModal>
        )}
        {modal == 'purchaseOrders' && (
          <PurchaseOrderModal
            token={token}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            stateData={purchaseOrder}
            stateMethod={createType}
            dynamicType={dynamicType}
            extractingStateData={extractingStateData}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            allData={allData}
            setAllData={setAllData}
            submitUpdate={submitUpdate}
            changeView={changeView}
            editData={editData}
          ></PurchaseOrderModal>
        )}
        {modal == 'purchaseList' && (
          <PurchaseOrderListModal
            token={token}
            account={account}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            stateData={activity}
            stateMethod={createType}
            dynamicType={dynamicType}
            extractingStateData={extractingStateData}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            allData={allData}
            setAllData={setAllData}
            submitUpdate={submitUpdate}
            changeView={changeView}
            editData={editData}
            autoFill={job}
            autoFillType={'purchaseOrders'}
            dataType={'purchaseOrders'}
            selectID={selectID}
            typeOfData={'job'}
            setEvent={setEvent}
          ></PurchaseOrderListModal>
        )}
        {modal == 'jobIssue' && (
          <JobIssueModal
            token={token}
            account={account}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            stateData={jobIssue}
            stateMethod={createType}
            dynamicType={dynamicType}
            extractingStateData={extractingStateData}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            allData={allData}
            setAllData={setAllData}
            submitUpdate={submitUpdate}
            changeView={changeView}
            editData={editData}
            autoFill={job}
            selectID={selectID}
            typeOfData={edit == 'jobIssues' ? 'jobIssues' : 'jobs'}
            setEvent={setEvent}
          ></JobIssueModal>
        )}
        {modal == 'accounts' && (
          <AccountsModal
            token={token}
            account={account}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            stateData={accountItem}
            stateMethod={createType}
            dynamicType={dynamicType}
            extractingStateData={extractingStateData}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            allData={allData}
            setAllData={setAllData}
            submitUpdate={submitUpdate}
            changeView={changeView}
            viewType={'job'}
            editData={editData}
            autoFill={nav.view === 'job' ? job : job}
            autoFillType={nav.view === 'job' ? 'account' : 'account'}
            dataType={'accounts'}
            selectID={selectID}
            typeOfData={nav.view}
            setEvent={setEvent}
          ></AccountsModal>
        )}
        {modal == 'price_list_items' && (
          <PriceListItemsModal
            token={token}
            account={account}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            stateData={priceList}
            stateMethod={createType}
            dynamicType={dynamicType}
            extractingStateData={extractingStateData}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            allData={allData}
            setAllData={setAllData}
            submitUpdate={submitUpdate}
            changeView={changeView}
            editData={editData}
            autoFill={accountItem}
            autoFillType={'priceLists'}
            dataType={'prices'}
            selectID={selectID}
            typeOfData={nav.view}
            setEvent={setEvent}
          ></PriceListItemsModal>
        )}
        {modal == 'job_list_items' && (
          <JobListItemsModal
            token={token}
            account={account}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            stateData={job}
            stateMethod={createType}
            dynamicType={dynamicType}
            extractingStateData={extractingStateData}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            allData={allData}
            setAllData={setAllData}
            submitUpdate={submitUpdate}
            changeView={changeView}
            editData={editData}
            autoFill={accountItem}
            autoFillType={'jobs'}
            dataType={'jobs'}
            selectID={selectID}
            typeOfData={nav.view}
            setEvent={setEvent}
          ></JobListItemsModal>
        )}
        {modal == 'contact_list_items' && (
          <ContactListItemsModal
            token={token}
            account={account}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            stateData={contact}
            stateMethod={createType}
            dynamicType={dynamicType}
            extractingStateData={extractingStateData}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            allData={allData}
            setAllData={setAllData}
            submitUpdate={submitUpdate}
            changeView={changeView}
            editData={editData}
            autoFill={accountItem}
            autoFillType={'contacts'}
            dataType={'contacts'}
            selectID={selectID}
            typeOfData={nav.view}
            setEvent={setEvent}
          ></ContactListItemsModal>
        )}
        {modal == 'add_edge' && (
          <EdgeModal
            token={token}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            stateData={edge}
            stateMethod={createType}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            allData={allData}
            setAllData={setAllData}
            submitUpdate={submitUpdate}
            changeView={changeView}
          ></EdgeModal>
        )}
        {modal == 'add_cutout' && (
          <CutoutModal
            token={token}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            stateData={cutout}
            stateMethod={createType}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            allData={allData}
            setAllData={setAllData}
            submitUpdate={submitUpdate}
            changeView={changeView}
          ></CutoutModal>
        )}
        {modal == 'purchaseOrderLines' && (
          <PurchaseOrderLinesModal
            token={token}
            account={account}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            stateData={POLine}
            stateMethod={createType}
            dynamicType={dynamicType}
            extractingStateData={extractingStateData}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            allData={allData}
            setAllData={setAllData}
            submitUpdate={submitUpdate}
            changeView={changeView}
            editData={editData}
            selectID={selectID}
            modalFormType={modalFormType}
            setModalFormType={setModalFormType}
            typeForm={typeForm}
            setTypeForm={setTypeForm}
            typeOfData={'purchaseOrderLines'}
            purchaseOrder={purchaseOrder}
          ></PurchaseOrderLinesModal>
        )}
        {modal == 'receivePurchaseOrders' && (
          <ReceivePurchaseOrdersModal
            token={token}
            account={account}
            message={message}
            setMessage={setMessage}
            setModal={setModal}
            loading={loading}
            setLoading={setLoading}
            edit={edit}
            setEdit={setEdit}
            stateData={purchaseOrder}
            stateMethod={createType}
            dynamicType={dynamicType}
            extractingStateData={extractingStateData}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            resetState={resetType}
            submitCreate={submitCreate}
            allData={allData}
            setAllData={setAllData}
            submitUpdate={submitUpdate}
            changeView={changeView}
            editData={editData}
            selectID={selectID}
            modalFormType={modalFormType}
            setModalFormType={setModalFormType}
            typeForm={typeForm}
            setTypeForm={setTypeForm}
            typeOfData={'purchaseOrders'}
            purchaseOrder={purchaseOrder}
          ></ReceivePurchaseOrdersModal>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    nav: state.nav,
    slab: state.slab,
    product: state.product,
    material: state.material,
    color: state.color,
    supplier: state.supplier,
    location: state.location,
    product: state.product,
    brand: state.brand,
    model: state.model,
    category: state.category,
    remnant: state.remnant,
    priceList: state.priceList,
    contact: state.contact,
    quote: state.quote,
    quoteLine: state.quoteLine,
    phase: state.phase,
    job: state.job,
    assignee: state.assignee,
    activity: state.activity,
    dependency: state.dependency,
    activityStatus: state.activityStatus,
    activitySet: state.activitySet,
    purchaseOrder: state.purchaseOrder,
    jobIssue: state.jobIssue,
    contract: state.contract,
    edge: state.edge,
    cutout: state.cutout,
    email: state.email,
    POLine: state.POLine,
    accountItem: state.account
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    hideSideNav: () => dispatch({ type: 'HIDE_SIDENAV' }),
    showSideNav: () => dispatch({ type: 'SHOW_SIDENAV' }),
    changeView: (view) => dispatch({ type: 'CHANGE_VIEW', value: view }),
    createType: (caseType, type, data) => dispatch({ type: caseType, name: type, value: data }),
    resetType: (caseType) => dispatch({ type: caseType }),
    addImages: (caseType, type, data) => dispatch({ type: caseType, name: type, value: data }),
  };
};

Dashboard.getInitialProps = async (context) => {
  let data = new Object();
  let deepClone;

  const token = getToken(context.req);
  let accessToken;
  if (token) { accessToken = token.split('=')[1] }

  data.slabs              = await tableData(accessToken, 'slabs/all-slabs');
  data.materials          = await tableData(accessToken, 'materials/all-materials');
  data.colors             = await tableData(accessToken, 'colors/all-colors');
  data.suppliers          = await tableData(accessToken, 'suppliers/all-suppliers');
  data.locations          = await tableData(accessToken, 'locations/all-locations');
  data.products           = await tableData(accessToken, 'products/all-products');
  data.remnants           = await tableData(accessToken, 'remnants/all-remnants');
  data.brands             = await tableData(accessToken, 'brands/all-brands');
  data.models             = await tableData(accessToken, 'models/all-models');
  data.categories         = await tableData(accessToken, 'categories/all-categories');
  data.remnants           = await tableData(accessToken, 'remnants/all-remnants');
  data.quotes             = await tableData(accessToken, 'quotes/all-quotes');
  data.contacts           = await tableData(accessToken, 'contact/all-contacts');
  data.prices             = await tableData(accessToken, 'price/all-prices');
  data.phases             = await tableData(accessToken, 'phases/all-phases');
  data.jobs               = await tableData(accessToken, 'jobs/all-jobs');
  data.assignees          = await tableData(accessToken, 'assignee/all-assignees');
  data.activities         = await tableData(accessToken, 'activities/all-activities');
  data.activityStatus     = await tableData(accessToken, 'activities/all-activity-status');
  data.activitySets       = await tableData(accessToken, 'activities/all-activity-sets');
  data.accounts           = await tableData(accessToken, 'accounts/all-accounts');
  data.purchaseOrders     = await tableData(accessToken, 'purchase-order/all-purchase-orders');
  data.jobIssues          = await tableData(accessToken, 'job-issue/all-job-issues');
  data.contracts          = await tableData(accessToken, 'contracts/all-contracts');
  data.edges              = await tableData(accessToken, 'edges/all-edges')
  data.cutouts            = await tableData(accessToken, 'cutouts/all-cutouts')
  deepClone               = _.cloneDeep(data);

  return {
    token: accessToken,
    data: Object.keys(data).length > 0 ? data : null,
    originalData: Object.keys(deepClone).length > 0 ? deepClone : null,
    // params: query
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withUser(Dashboard));
