export const validateImproveRequest = (req, res, next) => {
  const { section, content } = req.body;
  if (!section || !content) {
    return res.status(400).json({ error: 'Section and content are required' });
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
