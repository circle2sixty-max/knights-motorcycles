#!/usr/bin/env python3
"""
Leonardo.ai Image-to-Video Generator
Usage: python3 leonardo_video.py --image /path/to/image.jpg --output video.mp4
"""

import argparse
import json
import os
import sys
import time
import requests
from pathlib import Path

# CONFIG - Replace with your actual API key
LEONARDO_API_KEY = os.environ.get("LEONARDO_API_KEY", "YOUR_API_KEY_HERE")
BASE_URL = "https://cloud.leonardo.ai/api/rest/v1"

def upload_image(image_path):
    """Upload image to Leonardo and return generation ID"""
    print(f"📤 Uploading {image_path}...")
    
    # Step 1: Get upload URL
    headers = {
        "Authorization": f"Bearer {LEONARDO_API_KEY}",
        "Content-Type": "application/json"
    }
    
    # Get presigned URL
    response = requests.post(
        f"{BASE_URL}/init-image",
        headers=headers,
        json={"extension": Path(image_path).suffix.lstrip('.')}
    )
    
    if response.status_code != 200:
        print(f"❌ Failed to get upload URL: {response.text}")
        return None
    
    data = response.json()
    upload_url = data["uploadUrl"]
    image_id = data["id"]
    
    # Step 2: Upload file
    with open(image_path, "rb") as f:
        upload_response = requests.put(upload_url, data=f)
    
    if upload_response.status_code != 200:
        print(f"❌ Failed to upload image: {upload_response.text}")
        return None
    
    print(f"✅ Image uploaded: {image_id}")
    return image_id

def generate_motion(image_id, motion_strength=5):
    """Generate motion video from image"""
    print(f"🎬 Generating motion video (strength: {motion_strength})...")
    
    headers = {
        "Authorization": f"Bearer {LEONARDO_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "imageId": image_id,
        "motionStrength": motion_strength,  # 1-10, higher = more motion
        "isVariation": False
    }
    
    response = requests.post(
        f"{BASE_URL}/generations-motion",
        headers=headers,
        json=payload
    )
    
    if response.status_code != 200:
        print(f"❌ Failed to start generation: {response.text}")
        return None
    
    data = response.json()
    generation_id = data.get("motionSvdGeneration", {}).get("id")
    print(f"✅ Generation started: {generation_id}")
    return generation_id

def check_status(generation_id):
    """Check generation status and download when complete"""
    print("⏳ Waiting for video generation...")
    
    headers = {"Authorization": f"Bearer {LEONARDO_API_KEY}"}
    
    while True:
        response = requests.get(
            f"{BASE_URL}/generations/{generation_id}",
            headers=headers
        )
        
        if response.status_code != 200:
            print(f"❌ Failed to check status: {response.text}")
            return None
        
        data = response.json()
        status = data.get("generations_by_pk", {}).get("status")
        
        if status == "COMPLETE":
            video_url = data.get("generations_by_pk", {}).get("generated_images", [{}])[0].get("motionMP4Url")
            print(f"✅ Video ready: {video_url}")
            return video_url
        elif status == "FAILED":
            print("❌ Generation failed")
            return None
        
        print(f"  Status: {status}, waiting 5s...")
        time.sleep(5)

def download_video(url, output_path):
    """Download video to local file"""
    print(f"📥 Downloading to {output_path}...")
    
    response = requests.get(url, stream=True)
    if response.status_code != 200:
        print(f"❌ Failed to download: {response.status_code}")
        return False
    
    with open(output_path, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
    
    print(f"✅ Saved: {output_path}")
    return True

def main():
    parser = argparse.ArgumentParser(description="Generate video from image using Leonardo.ai")
    parser.add_argument("--image", "-i", required=True, help="Path to input image")
    parser.add_argument("--output", "-o", default="output.mp4", help="Output video path")
    parser.add_argument("--motion", "-m", type=int, default=5, help="Motion strength (1-10)")
    args = parser.parse_args()
    
    # Check API key
    if LEONARDO_API_KEY == "YOUR_API_KEY_HERE":
        print("❌ Please set LEONARDO_API_KEY environment variable")
        print("   export LEONARDO_API_KEY='your-api-key-here'")
        sys.exit(1)
    
    # Check image exists
    if not os.path.exists(args.image):
        print(f"❌ Image not found: {args.image}")
        sys.exit(1)
    
    print("🚀 Leonardo.ai Image-to-Video Generator")
    print("=" * 50)
    
    # Step 1: Upload image
    image_id = upload_image(args.image)
    if not image_id:
        sys.exit(1)
    
    # Step 2: Generate motion
    generation_id = generate_motion(image_id, args.motion)
    if not generation_id:
        sys.exit(1)
    
    # Step 3: Wait and get video URL
    video_url = check_status(generation_id)
    if not video_url:
        sys.exit(1)
    
    # Step 4: Download
    if download_video(video_url, args.output):
        print("\n✅ Done!")
        print(f"   Video: {os.path.abspath(args.output)}")
    else:
        print(f"\n⚠️  Video URL (download manually): {video_url}")

if __name__ == "__main__":
    main()
