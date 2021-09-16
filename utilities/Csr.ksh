
ECCTYPE=prime256v1

CertName=${1}
Password=${2}

[ "${CertName}" == "" ] && echo -ne "\033[31mUsage: Csr.ksh certname password\033[0m\n" && exit 0
[ "${Password}" == "" ] && echo -ne "\033[31mUsage: Csr.ksh certname password\033[0m\n" && exit 0

echo "Generating CSR and server key for ${1}"

mkdir -p certs/$CertName
cd certs/$CertName


country=us
organization=webkruncher
commonname=${1}

openssl req -new -newkey rsa:2048 -nodes -keyout server.key -passin pass:${2} -subj "/C=$country/O=$organization/CN=$commonname" -out cert.csr
cat cert.csr

