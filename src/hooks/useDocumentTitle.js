import { useLayoutEffect } from 'react';

const useDocumentTitle = (title) => {
  useLayoutEffect(() => {
    if (title) {
      document.title = title;
    } else {
      document.title = 'BABY-YARDS - eCommerce Shopping App';
    }
  }, [title]);
};

export default useDocumentTitle;
