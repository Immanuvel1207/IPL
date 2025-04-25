export const adminAuth = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  };
  
  export const buyerAuth = (req, res, next) => {
    if (req.user.role !== 'buyer') {
      return res.status(403).json({ message: 'Buyer access required' });
    }
    next();
  };
  
  export const playerAuth = (req, res, next) => {
    if (req.user.role !== 'player') {
      return res.status(403).json({ message: 'Player access required' });
    }
    next();
  };