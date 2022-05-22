package com.test.project.sample

import com.test.project.sample.Person
import groovy.util.GroovyTestCase

import org.junit.Test

class PersonUTest extends GroovyTestCase {

    @Test
    void testSomething() {
        Person person = new Person()
        assert person.greet('Toto').toString() == 'Hello Toto'
    }

}
