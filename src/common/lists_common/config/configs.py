


class Base:
    URL_API = 'http://10.0.0.82:6000/'
    URL_GUI = 'http://10.0.0.82:6001/'


class Production(Base):
    URL_API = 'https://api.lists.ryanrickgauer.com/'
    URL_GUI = 'https://lists.ryanrickgauer.com/'