package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/redis/go-redis/v9"
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

	err = client.HSet(ctx, "user:"+data.USERNAME, map[string]interface{}{
		"card1": data.CARD1,
		"card2": data.CARD2,
		"card3": data.CARD3,
		"card4": data.CARD4,
		"score": 0,
	}).Err()

	if err != nil {
		http.Error(w, "Failed to store data in Redis", http.StatusInternalServerError)
	}

	response := Response{
		MESSAGE: "new user created successfully",
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

	score, err := strconv.Atoi(result["score"])
	if err != nil {
		http.Error(w, "Failed to parse score", http.StatusInternalServerError)
		return
	}

	UserDetails := UserDetails {
		USERNAME: username,
		CARD1: result["card1"],
		CARD2: result["card2"],
		CARD3: result["card3"],
		CARD4: result["card4"],
		SCORE: score,
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
	http.HandleFunc("/health", heathCheck)
	http.HandleFunc("/addOrUpdateUser", addOrUpdateUser)
	http.HandleFunc("/getUserDetails", getUserDetails)
	startServer()
}