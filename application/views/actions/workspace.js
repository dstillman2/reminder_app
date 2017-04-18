export const changeTitle = title => (
  {
    type: 'CHANGE_TITLE',
    title,
  }
);

export const linkTo = (href, glyphicon) => (
  {
    type: 'ADD_LINK',
    linkTo: {
      href,
      glyphicon,
    },
  }
);

export const removeLinkTo = () => (
  {
    type: 'REMOVE_LINK_TO',
  }
);
