package com.test.project.sample;

/**
 * Java counterpart of GroovyCode.
 */
public final class JavaCode {

  /** Currency types. */
  public enum JavaEnum {
    /** Domestic. */
    DOMESTIC,
    /** Foreign. */
    FOREIGN,
    /** All. */
    ALL,
  }

  /** Utility class. */
  private JavaCode() {
  }

  /**
   * Label of a currency type.
   *
   * @param currencyType the type
   * @return its label
   */
  /* default */ static String getCurrencyType(final JavaEnum currencyType) {
    return switch (currencyType) {
      case DOMESTIC -> "Domestic";
      case FOREIGN -> "Foreign";
      case ALL -> "All";
    };
  }
}
