<?php
//CORS headers to allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Handle pre-flight requests (OPTIONS request)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Deck of cards generation
$deck = [];
$suits = ['S', 'H', 'D', 'C'];
$values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];

// Build the deck
foreach ($suits as $suit) {
    foreach ($values as $value) {
        $deck[] = $suit . '-' . $value;
    }
}

// Get the number of players from the input (POST request)
$data = json_decode(file_get_contents('php://input'), true);
$numPeople = $data['numPeople'];

// Validate input for number of people
if (!is_numeric($numPeople) || $numPeople < 1) {
    echo json_encode(['error' => 'Input value does not exist or value is invalid']);
    exit;
}

// If numPeople is greater than 52, we just use the mod operator to distribute cards in a cyclic manner
$numPeople = min($numPeople, 52);  // Make sure it's at least 1 and at most 52

$players = array_fill(0, $numPeople, []); 

// Distribute cards to players cyclically
foreach ($deck as $index => $card) {
    $players[$index % $numPeople][] = $card;
}

// Prepare the result as a single string with each player's cards on a new line
$formattedCards = [];
foreach ($players as $playerCards) {
    $formattedCards[] = implode(',', $playerCards);  // Join the cards with commas
}

// Send the result back as JSON
echo json_encode(['cards' => implode("\n", $formattedCards)]);

?>
