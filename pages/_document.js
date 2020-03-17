import Document, { Html, Head, Main, NextScript } from 'next/document'


class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
          
          {/* <!-- The core Firebase JS SDK is always required and must be listed first --> */}
          <script src="https://www.gstatic.com/firebasejs/7.11.0/firebase-app.js"></script>

          {/* <!-- TODO: Add SDKs for Firebase products that you want to use */}
          {/* https://firebase.google.com/docs/web/setup#available-libraries --> */}
          <script src="https://www.gstatic.com/firebasejs/7.11.0/firebase-analytics.js"></script>

          <script
            dangerouslySetInnerHTML={{
              __html: `
              // Your web app's Firebase configuration
              var firebaseConfig = {
                apiKey: "AIzaSyAm14Ri5TNEGLu3NpTvEMLZpJiLn1nmigg",
                authDomain: "koronakartta-2879f.firebaseapp.com",
                databaseURL: "https://koronakartta-2879f.firebaseio.com",
                projectId: "koronakartta-2879f",
                storageBucket: "koronakartta-2879f.appspot.com",
                messagingSenderId: "447729675638",
                appId: "1:447729675638:web:f20d46bc67f97c11719e57",
                measurementId: "G-LRT1QKWMQG"
              };
              // Initialize Firebase
              firebase.initializeApp(firebaseConfig);
              firebase.analytics();            
              `
            }}>
          </script>
        </body>
      </Html>
    )
  }
}

export default MyDocument
