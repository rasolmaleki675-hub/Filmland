package com.filmland.app

import android.annotation.SuppressLint
import android.content.ActivityNotFoundException
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.webkit.*
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        val settings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.mediaPlaybackRequiresUserGesture = false
        settings.allowFileAccess = true

        // JavaScript interface to trigger Native MX Player
        webView.addJavascriptInterface(WebAppInterface(this), "AndroidApp")

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: return false

                if (url.startsWith("intent:")) {
                    try {
                        val intent = Intent.parseUri(url, Intent.URI_INTENT_SCHEME)
                        if (intent != null) {
                            startActivity(intent)
                            return true
                        }
                    } catch (e: Exception) {
                        // If MX Player is not installed, open fallback
                        playInFallbackOrMx(url)
                        return true
                    }
                }
                return false
            }
        }

        // Load Filmland Web App (or local assets)
        webView.loadUrl("file:///android_asset/www/index.html")
    }

    private fun playInFallbackOrMx(videoUrl: String) {
        val mxPackageName = "com.mxtech.videoplayer.ad"
        val intent = Intent(Intent.ACTION_VIEW).apply {
            setDataAndType(Uri.parse(videoUrl), "video/*")
            setPackage(mxPackageName)
        }
        try {
            startActivity(intent)
        } catch (e: ActivityNotFoundException) {
            Toast.makeText(this, "برنامه MX Player پیدا نشد. لطفاً از پلی‌استور نصب کنید.", Toast.LENGTH_LONG).show()
            // Open Play Store to download MX Player
            val playStoreIntent = Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=$mxPackageName"))
            startActivity(playStoreIntent)
        }
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
