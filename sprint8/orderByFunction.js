const orderByFunction = (order) => {
  switch (order) {
    case 'recent':
      return { createdAt: 'desc' };
    case 'best':
      return { likes: 'desc' };
    default:
      return { createdAt: 'desc' };
  }
}

export default orderByFunction;