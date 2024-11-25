const validateSearchQuery = (req, res, next) => {
    try {
      const { query } = req.body;
      
      // Kiểm tra nếu query là một object
      if (typeof query !== 'object' || query === null) {
        return res.status(400).json({ 
          error: 'Invalid query format' 
        });
      }
  
      // Danh sách các operators được phép sử dụng
      const allowedOperators = ['$eq', '$gt', '$gte', '$lt', '$lte', '$in', '$regex'];
      
      // Danh sách các fields được phép tìm kiếm
      const allowedFields = ['username', 'email', 'status'];
  
      // Hàm đệ quy kiểm tra operators và fields
      const validateObject = (obj) => {
        for (let key in obj) {
          // Kiểm tra operators
          if (key.startsWith('$')) {
            if (!allowedOperators.includes(key)) {
              throw new Error(`Operator ${key} is not allowed`);
            }
          }
          
          // Kiểm tra fields
          if (!key.startsWith('$')) {
            if (!allowedFields.includes(key)) {
              throw new Error(`Field ${key} is not allowed`);
            }
          }
  
          // Kiểm tra giá trị đệ quy nếu là object
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            validateObject(obj[key]);
          }
        }
      };
  
      validateObject(query);
      next();
    } catch (error) {
      return res.status(400).json({ 
        error: 'Invalid query: ' + error.message 
      });
    }
  };