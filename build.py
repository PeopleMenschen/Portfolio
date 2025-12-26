import os
import shutil
import re

# تنظیمات
SOURCE_DIR = '.'  # پوشه فعلی
DIST_DIR = 'dist' # نام پوشه خروجی که آپلود می‌کنید

# فایل‌ها و پوشه‌هایی که نباید کپی شوند
IGNORE_LIST = {DIST_DIR, '.git', 'node_modules', '__pycache__', '.idea', 'build.py'}

def minify_content(content):
    """
    حذف فاصله‌های خالی و کامنت‌ها برای CSS و JS
    """
    # حذف کامنت‌های چند خطی (/* ... */)
    content = re.sub(r'/\*[\s\S]*?\*/', '', content)
    # حذف کامنت‌های تک خطی (// ...)
    content = re.sub(r'//.*', '', content)
    # تبدیل فاصله‌های متعدد و خط جدید به یک فاصله
    content = re.sub(r'\s+', ' ', content)
    return content.strip()

def build_project():
    print(f"🚀 شروع فرآیند بیلد... ایجاد پوشه {DIST_DIR}")
    
    # ایجاد پوشه dist اگر وجود نداشته باشد
    if os.path.exists(DIST_DIR):
        shutil.rmtree(DIST_DIR)
    os.makedirs(DIST_DIR)

    for root, dirs, files in os.walk(SOURCE_DIR):
        # حذف پوشه‌های نادیده گرفته شده از لیست
        dirs[:] = [d for d in dirs if d not in IGNORE_LIST]
        
        # ایجاد مسیر نسبی
        relative_path = os.path.relpath(root, SOURCE_DIR)
        
        # مدیریت پوشه‌ها
        if relative_path == '.':
            target_dir = DIST_DIR
        else:
            target_dir = os.path.join(DIST_DIR, relative_path)
            
        if not os.path.exists(target_dir):
            os.makedirs(target_dir)

        # مدیریت فایل‌ها
        for file in files:
            file_ext = os.path.splitext(file)[1].lower()
            source_file_path = os.path.join(root, file)
            target_file_path = os.path.join(target_dir, file)

            if file_ext in ['.css', '.js']:
                # فشرده‌سازی CSS و JS
                print(f"🔧 Minifying: {file}")
                try:
                    with open(source_file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    minified_content = minify_content(content)
                    with open(target_file_path, 'w', encoding='utf-8') as f:
                        f.write(minified_content)
                except Exception as e:
                    print(f"❌ خطا در فشرده‌سازی {file}: {e}")
                    # در صورت خطا، فایل اصلی کپی شود
                    shutil.copy2(source_file_path, target_file_path)
            
            elif file_ext in ['.html', '.htm', '.php', '.txt', '.md']:
                # کپی مستقیم فایل‌های متنی (برای امنیت بیشتر HTML را مینیفای نکردیم)
                print(f"📄 Copying: {file}")
                shutil.copy2(source_file_path, target_file_path)
                
            else:
                # کپی فایل‌های باینری (تصاویر، فونت‌ها و غیره)
                print(f"🖼️  Copying Asset: {file}")
                shutil.copy2(source_file_path, target_file_path)

    print("\n✅ پروژه با موفقیت بیلد شد!")
    print(f"📂 فایل‌های آماده برای هاست در پوشه '{DIST_DIR}' قرار دارند.")

if __name__ == "__main__":
    build_project()