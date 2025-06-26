import React from 'react';
import InvoiceForm from '../components/invoices/InvoiceForm';

const InvoiceNewPage = ({ isEdit }) => {
  return <InvoiceForm isEdit={isEdit} />;
};

export default InvoiceNewPage;
