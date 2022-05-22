package com.test.project.sample

public enum GroovyEnum {

    DOMESTIC,
    FOREIGN,
    ALL,

}

static final String getCurrencyType(final GroovyEnum currencyType) {
    switch (currencyType) {
        case null:
            return ''
        case GroovyEnum.DOMESTIC:
            return 'Domestic'
        case GroovyEnum.FOREIGN:
            return 'Foreign'
        case GroovyEnum.ALL:
            return 'All'
        default:
            throw new RuntimeException('Unsupported ' + GroovyEnum.getName() + '.' + currencyType)
    }
}
