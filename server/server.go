package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/redis/go-redis/v9"
	"github.com/rs/cors"
	"net/http"
	"strconv"
)

var ctx = context.Background()

type Response struct {
	MESSAGE string `json:"message"`
	STATUS int `json:"status"`
}

type UserDetails struct {
	USERNAME string `json:"username"`
	CARD1 string `json:"card1"`
	CARD2 string `json:"card2"`
	CARD3 string `json:"card3"`
	CARD4 string `json:"card4"`
	SCORE int `json:"score"`
}

type RequestBody struct {
	USERNAME string `json:"username"`
	CARD1 string `json:"card1"`
	CARD2 string `json:"card2"`
	CARD3 string `json:"card3"`
	CARD4 string `json:"card4"`
}

func heathCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	response := Response{
		MESSAGE: "The server is up and running",
		STATUS: http.StatusOK,
	}

	jsonResponse, err := json.Marshal(response)

	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
	
	w.WriteHeader(http.StatusOK)
	w.Write(jsonResponse)
}

func addOrUpdateUser(w http.ResponseWriter, r *http.Request) {
	if(r.Method != http.MethodPost) {
		http.Error(w, "Only POST methods are allowed", http.StatusMethodNotAllowed)
		return
	}

	var data RequestBody
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&data)
	if err != nil {
		http.Error(w, "Invalid JSON body", http.StatusBadRequest)
        return
	}

	client, err := connectRedis()
	if err != nil {
		fmt.Println("redis connection error", err)
		return
	}

	defer client.Close()

	exists, err := client.HExists(ctx, "user:"+data.USERNAME, "card1").Result()	
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	var score int

	if exists {
		result, err := client.HGetAll(ctx, "user:"+data.USERNAME).Result();
		if err != nil {
			http.Error(w, "Internal Server error", http.StatusInternalServerError)
			return
		}
		
		tempScore, err := strconv.Atoi(result["score"])
		if err != nil {
			http.Error(w, "Failed to parse score", http.StatusInternalServerError)
			return
		}
		
		score = tempScore
	} else {
		score = 0
	}

	err = client.HSet(ctx, "user:"+data.USERNAME, map[string]interface{}{
		"card1": data.CARD1,
		"card2": data.CARD2,
		"card3": data.CARD3,
		"card4": data.CARD4,
		"score": score,
	}).Err()

	if err != nil {
		http.Error(w, "Failed to store data in Redis", http.StatusInternalServerError)
	}

	var response Response

	if exists {
		response = Response{
			MESSAGE: "user updated successfully",
			STATUS: http.StatusOK,
		}
	} else {
		response = Response{
			MESSAGE: "new user created successfully",
			STATUS: http.StatusOK,
		}
	}

	jsonResponse, err := json.Marshal(response)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonResponse)
}

func getUserDetails(w http.ResponseWriter, r *http.Request) {
	if(r.Method != http.MethodGet) {
		http.Error(w, "Only Get method is allowed", http.StatusMethodNotAllowed)
		return 
	}

	queryParams := r.URL.Query()
	username := queryParams.Get("username")
	fmt.Println(username)
	if username == "" || len(username) == 0 {
		http.Error(w, "Invalid Username", http.StatusBadRequest)
		return
	}

	client, err := connectRedis()
	if err != nil {
		fmt.Println("redis connection error", err)
		return
	}

	result, err := client.HGetAll(ctx, "user:"+username).Result();
	if err != nil {
		http.Error(w, "Internal Server error", http.StatusInternalServerError)
		return
	}

	UserDetails := UserDetails {
		USERNAME: username,
		CARD1: result["card1"],
		CARD2: result["card2"],
		CARD3: result["card3"],
		CARD4: result["card4"],
	}

	jsonResponse, err := json.Marshal(UserDetails)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonResponse)
}

func hasWon(w http.ResponseWriter, r *http.Request) {
	if(r.Method != http.MethodGet) {
		http.Error(w, "Only Get Methods are allowed", http.StatusMethodNotAllowed)
		return 
	}

	queryParams := r.URL.Query()
	username := queryParams.Get("username")

	client, err := connectRedis()
	if err != nil {
		fmt.Println("redis connection error", err)
		return
	}

	exists, err := client.HExists(ctx, "user:"+username, "card1").Result()	
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	if exists {
		scoreString, err := client.HGet(ctx, "user:"+username, "score").Result()
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return 
		}
		
		score, err := strconv.Atoi(scoreString)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return 
		}

		err = client.HSet(ctx, "user:"+username, map[string]interface{}{
			"score": score + 1,
		}).Err()

		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return 
		}

		response := Response{
			MESSAGE: "score updated successfully",
			STATUS: http.StatusOK,
		}

		jsonResponse, err := json.Marshal(response)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(jsonResponse)

	} else {
		http.Error(w, "no player with this username", http.StatusBadRequest)
	}
}

func startServer() {
	fmt.Println("Sever listening on port 3000")
	err := http.ListenAndServe(":3000", nil)
	if(err != nil) {
		fmt.Println("Error in starting server", err)
	}
}

func connectRedis() (*redis.Client, error)  {
	client := redis.NewClient(&redis.Options{
		Addr: "127.0.0.1:6379",
		Password: "", 
		DB: 0,
	})

	_, err := client.Ping(ctx).Result()

	if err != nil {
		return nil, fmt.Errorf("failed to connect to redis: %v", err)
	}

	fmt.Println("Connected to Redis successfully")
	return client, nil
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/health", heathCheck)
	mux.HandleFunc("/addOrUpdateUser", addOrUpdateUser)
	mux.HandleFunc("/getUserDetails", getUserDetails)
	mux.HandleFunc("/hasWon", hasWon)

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://example.com", "http://localhost:3000"}, // Change as needed
		AllowCredentials: true,
	})

	handler := c.Handler(mux)

	fmt.Println("Server listening on port 3000")
	err := http.ListenAndServe(":3000", handler)
	if err != nil {
		fmt.Println("Error in starting server", err)
	}
}