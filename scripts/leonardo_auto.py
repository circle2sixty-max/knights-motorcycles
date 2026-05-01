#!/usr/bin/env python3
"""
Leonardo Motion 2.0 自动化脚本
自动上传图片、生成视频、下载结果
"""

import time
import os
from playwright.sync_api import sync_playwright

# 配置
LEONARDO_URL = "https://app.leonardo.ai/generate?model=motion_2.0-fast"
IMAGE_PATH = "/Users/yuantao/.openclaw/workspace-circle-claw-feishu/projects/knights-motorcycles/public/images/hero-track.jpeg"
OUTPUT_DIR = "/Users/yuantao/.openclaw/workspace-circle-claw-feishu/projects/knights-motorcycles/public/videos"

def main():
    print("🎬 Leonardo Motion 2.0 自动化生成")
    print("=" * 50)
    
    # 确保输出目录存在
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    with sync_playwright() as p:
        # 启动浏览器（使用已登录的 Chrome profile）
        print("🚀 启动浏览器...")
        context = p.chromium.launch_persistent_context(
            "/Users/yuantao/Library/Application Support/Google/Chrome",
            headless=False,  # 设置为 True 可以后台运行
            args=["--profile-directory=Default"]
        )
        
        page = context.new_page()
        
        # 1. 打开 Leonardo Motion 页面
        print(f"📱 打开 {LEONARDO_URL}")
        page.goto(LEONARDO_URL)
        time.sleep(3)
        
        # 2. 上传图片
        print(f"📤 上传图片: {IMAGE_PATH}")
        
        # 找到文件输入框（通常是隐藏的 input[type=file]）
        # Leonardo 可能有拖放区域或上传按钮
        try:
            # 尝试点击上传区域
            upload_area = page.locator("text='Upload an image'").first
            if upload_area.is_visible():
                upload_area.click()
                time.sleep(1)
            
            # 找到文件输入框
            file_input = page.locator("input[type='file']").first
            file_input.set_input_files(IMAGE_PATH)
            print("✅ 图片上传成功")
            time.sleep(3)
            
        except Exception as e:
            print(f"⚠️  自动上传失败: {e}")
            print("请手动拖放图片到页面，然后按回车继续...")
            input()
        
        # 3. 调整 Motion 强度（如果有滑块）
        print("⚙️  设置 Motion 强度...")
        try:
            # 查找 Motion Strength 滑块
            slider = page.locator("[data-testid='motion-strength']").first
            if slider.is_visible():
                # 设置为中等强度
                slider.fill("5")
                time.sleep(1)
        except:
            print("  使用默认设置")
        
        # 4. 点击生成按钮
        print("🎬 开始生成视频...")
        try:
            generate_btn = page.locator("button:has-text('Generate')").first
            if generate_btn.is_visible():
                generate_btn.click()
                print("✅ 已点击生成按钮")
            else:
                print("⚠️  未找到生成按钮，请手动点击")
                input("按回车继续...")
        except Exception as e:
            print(f"⚠️  自动点击失败: {e}")
            input("请手动点击生成按钮，然后按回车...")
        
        # 5. 等待生成完成
        print("⏳ 等待视频生成（约 30-60 秒）...")
        time.sleep(10)
        
        # 轮询检查是否完成
        max_wait = 120  # 最多等 2 分钟
        for i in range(max_wait // 5):
            time.sleep(5)
            try:
                # 检查是否有下载按钮或视频出现
                download_btn = page.locator("button:has-text('Download')").first
                if download_btn.is_visible():
                    print("✅ 视频生成完成！")
                    break
            except:
                print(f"  等待中... ({(i+1)*5}s)")
        
        # 6. 下载视频
        print("📥 下载视频...")
        try:
            # 设置下载路径
            page.on("download", lambda download: print(f"  下载: {download.suggested_filename}"))
            
            download_btn = page.locator("button:has-text('Download')").first
            if download_btn.is_visible():
                download_btn.click()
                print(f"✅ 视频已开始下载到: {OUTPUT_DIR}")
                time.sleep(3)
            else:
                print("⚠️  未找到下载按钮")
                
        except Exception as e:
            print(f"⚠️  自动下载失败: {e}")
            print("请手动下载视频到:", OUTPUT_DIR)
        
        print("\n✅ 脚本执行完成")
        print(f"📁 检查下载目录: {OUTPUT_DIR}")
        
        # 保持浏览器打开，让用户可以看到结果
        input("\n按回车关闭浏览器...")
        context.close()

if __name__ == "__main__":
    main()
