from lists_common import config
from lists import app, api_wrapper

if __name__ == "__main__":
    api_wrapper.URL_BASE = config.Base.URL_API
    app.run(debug=True, host="0.0.0.0", port=6001, threaded=True)
    


    