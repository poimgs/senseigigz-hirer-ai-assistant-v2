export const validateImproveRequest = (req, res, next) => {
  const { section } = req.body;
  if (!section) {
    return res.status(400).json({ error: 'Section is required' });
  }
  next();
};

export const validateConvertRequest = (req, res, next) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text content is required' });
  }
  next();
};
