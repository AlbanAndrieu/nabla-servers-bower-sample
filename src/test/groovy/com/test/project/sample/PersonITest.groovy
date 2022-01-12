package com.test.project.sample

import com.test.project.sample.Person
import groovy.util.GroovyTestCase

import org.junit.Test

class PersonITest extends GroovyTestCase {

    @Test
    void testSomething() {
        Person person = new Person()
        person.setName('God')
        assert person.name().toString() == 'Hello God'
    }

}
