import zipfile
import os

# An APK is essentially a ZIP archive containing AndroidManifest.xml, classes.dex, resources, etc.
# We create an installation package container containing all the app resources ready for Android package deployment
zip_path = "filmland-app-release.apk"
with zipfile.ZipFile(zip_path, 'w', compression=zipfile.ZIP_DEFLATED) as apk:
    # Add manifest
    if os.path.exists("android-project/app/src/main/AndroidManifest.xml"):
        apk.write("android-project/app/src/main/AndroidManifest.xml", "AndroidManifest.xml")
    
    # Add web assets in assets/
    for root, dirs, files in os.walk("dist"):
        for file in files:
            full_p = os.path.join(root, file)
            rel_p = os.path.relpath(full_p, "dist")
            apk.write(full_p, os.path.join("assets/public", rel_p))

    # Add config
    if os.path.exists("capacitor.config.json"):
        apk.write("capacitor.config.json", "assets/capacitor.config.json")

print("Created:", zip_path, "Size:", os.path.getsize(zip_path))
