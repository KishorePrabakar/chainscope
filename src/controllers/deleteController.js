const db = require('../../database');

const deleteAddress = async (req, res) => {
  const { id } = req.params;
  
  try {
    const stmt = db.prepare('DELETE FROM addresses WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Address not found' 
      });
    }
    
    res.json({ 
      success: true,
      message: `Address ${id} deleted successfully` 
    });
    
  } catch (error) {
    console.error('Delete error:', error.message);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

module.exports = { deleteAddress };