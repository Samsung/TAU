package com.example.scheduleapp

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var webSettings: WebSettings

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
        //in order to run TAU library
        webSettings.javaScriptEnabled = true
        //in order to have title bar buttons visible
        webSettings.allowFileAccessFromFileURLs = true
        //in order to navigate between files
        webSettings.allowUniversalAccessFromFileURLs = true

        webView.loadUrl("file:///android_asset/ScheduleApp/index.html")
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
