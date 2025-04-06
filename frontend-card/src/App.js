import React, { useState } from 'react';
import { Button, TextField, Typography, Container, CircularProgress, Alert } from '@mui/material';

const App = () => {
  const [numPeople, setNumPeople] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error,setError] = useState('');

  // Handle input change
  const handleChange = (event) => {
    setNumPeople(event.target.value);
  };

// Map for card values
const cardValueMap = {
  1: 'A', 10: 'X', 11: 'J', 12: 'Q', 13: 'K',
};

// Format card suits and values
const formatCard = (suit, value) => {
  // Ensure the value is a number
  const numericValue = parseInt(value, 10);

  // Card value: 2-9 are as is, and 1 = A, 10 = X, 11 = J, 12 = Q, 13 = K
  const cardValue = cardValueMap[numericValue] || (numericValue >= 2 && numericValue <= 9 ? numericValue : null);

  return cardValue ? `${suit}-${cardValue}` : null;
};

// Handle form submission
const handleSubmit = async (event) => {
  event.preventDefault();

  // Validation for number of people
  if (numPeople < 1) {
    alert('Input value does not exist or value is invalid');
    return;
  }

  setLoading(true); // Start loading spinner

  try {
    const response = await fetch('http://localhost:8000/distribute.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ numPeople }),
    });

    const data = await response.json();
    
    if (data.error) {
      setError(data.error);
    } else {
      // Format the cards using formatCard
      const formattedResult = data.cards
        .split('\n')  // Split each player's cards into a new row
        .map((line) => {
          return line
            .split(',')  // Split each card by comma
            .map((card) => {
              const [suit, value] = card.split('-');
              return formatCard(suit, value);  // Format each card
            })
            .filter(Boolean)  // Remove any null or undefined values
            .join(',');  // Join back into a single string
        })
        .join('\n');  // Join all the rows back

      setResult(formattedResult);  // Set the formatted result
    }
  } catch (error) {
    setError('Irregularity occurred');
  } finally {
    setLoading(false);  // Stop loading spinner
  }
};
  
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom align="center">
        Card Distribution
      </Typography>

      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="Enter Number of Players"
          variant="outlined"
          type="number"
          value={numPeople}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          disabled={loading || !numPeople}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Distribute Cards'}
        </Button>
      </form>

      {error && <Alert severity="error" sx={{ marginTop: 2 }}>{error}</Alert>}

      {result && (
        <div>
          <Typography variant="h6" align="center" sx={{ marginTop: 2 }}>
            Distributed Cards:
          </Typography>
          <pre style={{ textAlign: 'center', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {result}
          </pre>
        </div>
      )}
    </Container>
  );
};

export default App;
