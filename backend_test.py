#!/usr/bin/env python3
"""
Backend Test Suite for Les Embruns Restaurant
Tests all API endpoints and MongoDB functionality
"""

import requests
import json
import time
import sys
from datetime import datetime

# Backend URL from frontend/.env
BACKEND_URL = "https://saint-martin-bistro.preview.emergentagent.com/api"

# Valid access code for testing
VALID_ACCESS_CODE = "2108"
INVALID_ACCESS_CODE = "1234"

class TestResults:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.errors = []
        
    def log_success(self, test_name):
        print(f"✅ {test_name}")
        self.passed += 1
        
    def log_failure(self, test_name, error):
        print(f"❌ {test_name}: {error}")
        self.failed += 1
        self.errors.append(f"{test_name}: {error}")
        
    def summary(self):
        total = self.passed + self.failed
        print(f"\n{'='*60}")
        print(f"TEST SUMMARY")
        print(f"{'='*60}")
        print(f"Total tests: {total}")
        print(f"Passed: {self.passed}")
        print(f"Failed: {self.failed}")
        print(f"Success rate: {(self.passed/total*100):.1f}%" if total > 0 else "No tests run")
        
        if self.errors:
            print(f"\n{'='*60}")
            print("FAILED TESTS:")
            print(f"{'='*60}")
            for error in self.errors:
                print(f"• {error}")

def test_health_check(results):
    """Test GET /api/health endpoint"""
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "healthy":
                results.log_success("Health Check - Status healthy")
            else:
                results.log_failure("Health Check", f"Unexpected status: {data}")
        else:
            results.log_failure("Health Check", f"HTTP {response.status_code}: {response.text}")
            
    except Exception as e:
        results.log_failure("Health Check", f"Request failed: {str(e)}")

def test_restaurant_info(results):
    """Test GET /api/restaurant/info endpoint"""
    try:
        response = requests.get(f"{BACKEND_URL}/restaurant/info", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            # Verify required fields
            required_fields = ["name", "tagline", "location", "description", "hero", "about", "contact"]
            missing_fields = [field for field in required_fields if field not in data]
            
            if missing_fields:
                results.log_failure("Restaurant Info", f"Missing fields: {missing_fields}")
            else:
                # Verify restaurant name
                if data.get("name") == "Les Embruns":
                    results.log_success("Restaurant Info - Name correct")
                else:
                    results.log_failure("Restaurant Info", f"Wrong name: {data.get('name')}")
                
                # Verify location
                if "Saint Martin de Ré" in data.get("location", ""):
                    results.log_success("Restaurant Info - Location correct")
                else:
                    results.log_failure("Restaurant Info", f"Wrong location: {data.get('location')}")
                
                # Verify hero section
                hero = data.get("hero", {})
                if hero.get("title") and hero.get("subtitle") and hero.get("image"):
                    results.log_success("Restaurant Info - Hero section complete")
                else:
                    results.log_failure("Restaurant Info", "Hero section incomplete")
                
                # Verify contact info
                contact = data.get("contact", {})
                if contact.get("phone") and contact.get("address") and contact.get("hours"):
                    results.log_success("Restaurant Info - Contact info complete")
                else:
                    results.log_failure("Restaurant Info", "Contact info incomplete")
        else:
            results.log_failure("Restaurant Info", f"HTTP {response.status_code}: {response.text}")
            
    except Exception as e:
        results.log_failure("Restaurant Info", f"Request failed: {str(e)}")

def test_menu(results):
    """Test GET /api/menu endpoint"""
    try:
        response = requests.get(f"{BACKEND_URL}/menu", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            if isinstance(data, list) and len(data) > 0:
                results.log_success("Menu - Data structure valid")
                
                # Check for expected categories
                category_names = [cat.get("name", "") for cat in data]
                expected_categories = ["Entrées", "Plats", "Desserts"]
                
                found_categories = [cat for cat in expected_categories if cat in category_names]
                if len(found_categories) == len(expected_categories):
                    results.log_success("Menu - All categories present")
                else:
                    missing = [cat for cat in expected_categories if cat not in category_names]
                    results.log_failure("Menu", f"Missing categories: {missing}")
                
                # Verify menu items structure
                valid_items = True
                for category in data:
                    items = category.get("items", [])
                    if not items:
                        valid_items = False
                        break
                    
                    for item in items:
                        if not all(key in item for key in ["name", "description", "price"]):
                            valid_items = False
                            break
                
                if valid_items:
                    results.log_success("Menu - Items structure valid")
                else:
                    results.log_failure("Menu", "Invalid item structure")
                    
            else:
                results.log_failure("Menu", "Empty or invalid menu data")
        else:
            results.log_failure("Menu", f"HTTP {response.status_code}: {response.text}")
            
    except Exception as e:
        results.log_failure("Menu", f"Request failed: {str(e)}")

def test_gallery(results):
    """Test GET /api/gallery endpoint"""
    try:
        response = requests.get(f"{BACKEND_URL}/gallery", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            if isinstance(data, list) and len(data) > 0:
                results.log_success("Gallery - Data structure valid")
                
                # Verify gallery items structure
                valid_items = True
                for item in data:
                    if not all(key in item for key in ["image", "alt"]):
                        valid_items = False
                        break
                    
                    # Check if image URL is valid format
                    if not item.get("image", "").startswith("http"):
                        valid_items = False
                        break
                
                if valid_items:
                    results.log_success("Gallery - Items structure valid")
                else:
                    results.log_failure("Gallery", "Invalid item structure")
                    
                # Check for different categories
                categories = set(item.get("category") for item in data if item.get("category"))
                if len(categories) > 1:
                    results.log_success("Gallery - Multiple categories present")
                else:
                    results.log_failure("Gallery", "Limited category diversity")
                    
            else:
                results.log_failure("Gallery", "Empty or invalid gallery data")
        else:
            results.log_failure("Gallery", f"HTTP {response.status_code}: {response.text}")
            
    except Exception as e:
        results.log_failure("Gallery", f"Request failed: {str(e)}")

def test_access_verification(results):
    """Test POST /api/access/verify endpoint"""
    
    # Test valid access code
    try:
        payload = {"code": VALID_ACCESS_CODE}
        response = requests.post(f"{BACKEND_URL}/access/verify", 
                               json=payload, 
                               timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get("success") is True:
                results.log_success("Access Verification - Valid code accepted")
                
                # Check for session ID
                session_id = data.get("session_id")
                if session_id:
                    results.log_success("Access Verification - Session ID generated")
                    
                    # Test session check with valid session
                    test_session_check(results, session_id, True)
                else:
                    results.log_failure("Access Verification", "No session ID returned")
            else:
                results.log_failure("Access Verification", f"Valid code rejected: {data}")
        else:
            results.log_failure("Access Verification", f"HTTP {response.status_code}: {response.text}")
            
    except Exception as e:
        results.log_failure("Access Verification", f"Valid code test failed: {str(e)}")
    
    # Test invalid access code
    try:
        payload = {"code": INVALID_ACCESS_CODE}
        response = requests.post(f"{BACKEND_URL}/access/verify", 
                               json=payload, 
                               timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get("success") is False:
                results.log_success("Access Verification - Invalid code rejected")
                
                # Should not have session ID
                if not data.get("session_id"):
                    results.log_success("Access Verification - No session for invalid code")
                else:
                    results.log_failure("Access Verification", "Session created for invalid code")
            else:
                results.log_failure("Access Verification", f"Invalid code accepted: {data}")
        else:
            results.log_failure("Access Verification", f"HTTP {response.status_code}: {response.text}")
            
    except Exception as e:
        results.log_failure("Access Verification", f"Invalid code test failed: {str(e)}")

def test_session_check(results, session_id, should_be_valid):
    """Test GET /api/access/check/{session_id} endpoint"""
    try:
        response = requests.get(f"{BACKEND_URL}/access/check/{session_id}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            has_access = data.get("hasAccess", False)
            
            if should_be_valid and has_access:
                results.log_success("Session Check - Valid session confirmed")
            elif not should_be_valid and not has_access:
                results.log_success("Session Check - Invalid session rejected")
            else:
                results.log_failure("Session Check", f"Unexpected result: {data}")
        else:
            results.log_failure("Session Check", f"HTTP {response.status_code}: {response.text}")
            
    except Exception as e:
        results.log_failure("Session Check", f"Request failed: {str(e)}")

def test_invalid_session_check(results):
    """Test session check with invalid session ID"""
    fake_session_id = "invalid-session-12345"
    test_session_check(results, fake_session_id, False)

def test_mongodb_persistence(results):
    """Test MongoDB data persistence by making multiple requests"""
    try:
        # Make multiple requests to ensure data is persistent
        responses = []
        for i in range(3):
            response = requests.get(f"{BACKEND_URL}/restaurant/info", timeout=10)
            if response.status_code == 200:
                responses.append(response.json())
            time.sleep(0.5)
        
        if len(responses) == 3:
            # Check if all responses are identical (data persistence)
            if responses[0] == responses[1] == responses[2]:
                results.log_success("MongoDB Persistence - Data consistent across requests")
            else:
                results.log_failure("MongoDB Persistence", "Data inconsistent across requests")
        else:
            results.log_failure("MongoDB Persistence", "Failed to get consistent responses")
            
    except Exception as e:
        results.log_failure("MongoDB Persistence", f"Test failed: {str(e)}")

def test_error_handling(results):
    """Test error handling for non-existent endpoints"""
    try:
        response = requests.get(f"{BACKEND_URL}/nonexistent", timeout=10)
        
        if response.status_code == 404:
            results.log_success("Error Handling - 404 for non-existent endpoint")
        else:
            results.log_failure("Error Handling", f"Unexpected status for non-existent endpoint: {response.status_code}")
            
    except Exception as e:
        results.log_failure("Error Handling", f"Test failed: {str(e)}")

def main():
    print("🧪 Starting Les Embruns Backend Test Suite")
    print(f"Testing backend at: {BACKEND_URL}")
    print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*60)
    
    results = TestResults()
    
    # Run all tests
    test_health_check(results)
    test_restaurant_info(results)
    test_menu(results)
    test_gallery(results)
    test_access_verification(results)
    test_invalid_session_check(results)
    test_mongodb_persistence(results)
    test_error_handling(results)
    
    # Print summary
    results.summary()
    
    # Return exit code based on results
    return 0 if results.failed == 0 else 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)