package com.filmland.app

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.webkit.JavascriptInterface
import android.widget.Toast

class WebAppInterface(private val mContext: Context) {

    @JavascriptInterface
    fun playInMxPlayer(url: String, title: String) {
        try {
            val intent = Intent(Intent.ACTION_VIEW).apply {
                setDataAndType(Uri.parse(url), "video/*")
                putExtra("title", title)
                setPackage("com.mxtech.videoplayer.ad")
            }
            mContext.startActivity(intent)
        } catch (e: Exception) {
            Toast.makeText(mContext, "برنامه MX Player یافت نشد. باز کردن در مارکت...", Toast.LENGTH_SHORT).show()
            val marketIntent = Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=com.mxtech.videoplayer.ad"))
            mContext.startActivity(marketIntent)
        }
    }
}
