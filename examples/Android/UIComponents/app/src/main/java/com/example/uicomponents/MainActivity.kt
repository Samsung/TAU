package com.example.uicomponents

import android.annotation.SuppressLint
import android.os.Build
import android.os.Bundle
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity

    class MainActivity : AppCompatActivity() {

        private lateinit var webView: WebView
        private lateinit var webSettings: WebSettings

        @RequiresApi(Build.VERSION_CODES.LOLLIPOP)
        @SuppressLint("SetJavaScriptEnabled")
        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            setContentView(R.layout.activity_main)

            webView = findViewById(R.id.webView)
            webView.webViewClient = object : WebViewClient() {
                override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                    view?.loadUrl(url)
                    return true
                }
            }

            webSettings = webView.settings
            webSettings.javaScriptEnabled = true
            webSettings.setSupportMultipleWindows(false)
            webSettings.javaScriptCanOpenWindowsAutomatically = false
            webSettings.loadWithOverviewMode = true
            webSettings.useWideViewPort = true
            webSettings.setSupportZoom(true)
            webSettings.builtInZoomControls = true
            webSettings.layoutAlgorithm = WebSettings.LayoutAlgorithm.NORMAL
            webSettings.cacheMode = WebSettings.LOAD_NO_CACHE
            webSettings.domStorageEnabled = true
            webSettings.allowContentAccess = true
            webSettings.allowFileAccessFromFileURLs = true
            webSettings.allowUniversalAccessFromFileURLs = true
            webSettings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW

            webView.loadUrl("file:///android_asset/UIComponents/index.html")
        }

        override fun onBackPressed() {
            if (webView.canGoBack()) {
                webView.goBack()
            } else {
                super.onBackPressed()
            }
        }
    }