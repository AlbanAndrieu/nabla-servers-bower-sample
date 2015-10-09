#!/bin/bash
# This script is not used to generate keystore. It was used for testing purpose (as cargo-maven2-plugin was corrupting the keystore)
[[ -n "$DEBUG" ]] &&  set -x

cd src/main/config/demo-base/

echo "ARCH : ${ARCH} must be sun4sol sun4 rs6000 hprisc solaris linux cygwin winnt"

if [ "$ARCH" = "winnt" ]; then
    KEYTOOL_CMD="bin/keytool.exe"
    else
    KEYTOOL_CMD="bin/keytool"
fi

function generateKeystore  {
    typeset STORE="$1"
    shift
    typeset STOREPASSWD="$1"
    shift
    typeset KEYPASSWD="$STOREPASSWD"
    if [ "$ARCH" = "winnt" ]; then
        STORE=`cygpath -wp $STORE`
    fi
    HOSTNAME=`hostname`
    echo "Building certificates for ssl"
    KEYSTOREDIR=$(dirname "$STORE")

	if [ -z "$ALIAS" ]
	then
		echo "ERROR: Set ALIAS environment variable!"
		export ALIAS="jetty"
	fi

	if [ -z "$DOMAIN" ]
	then
		echo "ERROR: Set DOMAIN environment variable!"
		#export DOMAIN=`domainname`
		export DOMAIN="nabla.mobi"
	fi
    if [ "$DOMAIN" = "" ]; then
        HTTP_URL="$HOSTNAME"
    else
        HTTP_URL="$HOSTNAME.$DOMAIN"
    fi

    [[ -d "$KEYSTOREDIR" ]] || mkdir -p "$KEYSTOREDIR"
    #-ext 'SAN=dns:jetty.eclipse.org,dns:*.jetty.org'
    ${JAVA_HOME}/${KEYTOOL_CMD} -genkey -v  -alias "$ALIAS" -keystore "$STORE" -keyalg RSA -sigalg SHA256withRSA -storepass "$STOREPASSWD" -keysize 2048 -validity 36500 << EOF
$HTTP_URL
Nabla Team
Nabla
Paris
75012
FR
yes

EOF
    ${JAVA_HOME}/${KEYTOOL_CMD} -alias "$ALIAS" -selfcert -validity 36500 -keystore "$STORE" -storepass "$STOREPASSWD" -keypass "$KEYPASSWD"

}

KEYSTOREFILE="keystore"
TRUSTSTOREFILE="${KEYSTOREFILE}"
STOREPASSWD="microsoft"
STORE="keystore"

########
# Checking SSL config
#####
#check the ssl keystore is here or build it
[[  -f "$KEYSTOREFILE" ]] || generateKeystore "$KEYSTOREFILE" "${STOREPASSWD}" ||  die "generateKeystore '$KEYSTOREFILE'" failed
#[[  -f "$TRUSTSTOREFILE" ]] || cp "$KEYSTOREFILE" "$TRUSTSTOREFILE" || die  "cp '$KEYSTOREFILE' '$TRUSTSTOREFILE' failed"

echo "-Djavax.net.ssl.keyStore=$KEYSTOREFILE -Djavax.net.ssl.keyStorePassword=$STOREPASSWD -Djavax.net.ssl.trustStore=$TRUSTSTOREFILE -Djavax.net.ssl.trustStorePassword=$STOREPASSWD"
echo "-Djetty.sslContext.keyStorePath=$KEYSTOREFILE -Djetty.sslContext.keyStorePassword=$STOREPASSWD -Djetty.sslContext.trustStorePath=$TRUSTSTOREFILE -Djetty.sslContext.trustStorePassword=$STOREPASSWD"
