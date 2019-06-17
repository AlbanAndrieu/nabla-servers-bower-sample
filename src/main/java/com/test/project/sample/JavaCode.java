package com.test.project.sample;

public class JavaCode {
    public enum JavaEnum {
        DOMESTIC,
        FOREIGN,
        ALL,
    };

    static final String getCurrencyType(final JavaEnum currencyType) {
        switch (currencyType) {
        case DOMESTIC:
            return "Domestic";
        case FOREIGN:
            return "Foreign";
        case ALL:
            return "All";
        default:
            throw new RuntimeException("Unsupported " + JavaEnum.class.getSimpleName() + "." + currencyType);
        }
    }
}
