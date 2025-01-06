const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Połącz się z MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Eng', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schemat użytkownika
const userSchema = new mongoose.Schema({
  email: String,
  password: String, // Hasło haszowane
});

// Model użytkownika
const User = mongoose.model('User', userSchema);

// Funkcja dodania użytkownika
const addUser = async () => {
  const email = 'zbigniew@test.pl';
  const plainPassword = '123457';
  
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
    });
    
    await newUser.save();
    console.log('Użytkownik dodany pomyślnie!');
  } catch (err) {
    console.error('Błąd podczas dodawania użytkownika:', err);
  } finally {
    mongoose.connection.close();
  }
};

addUser();
