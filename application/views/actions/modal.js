const openModal = ({ title, content, footer, schema }) => (
  {
    type: 'OPEN_MODAL',
    title,
    content,
    footer,
    schema,
  }
);

const closeModal = () => (
  {
    type: 'CLOSE_MODAL',
  }
);

export { openModal, closeModal };
