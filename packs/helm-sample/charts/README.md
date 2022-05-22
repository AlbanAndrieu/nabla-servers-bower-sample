# helm-sample

![Version: ~1.8.0](https://img.shields.io/badge/Version-~1.8.0-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: 1.8.1](https://img.shields.io/badge/AppVersion-1.8.1-informational?style=flat-square)

A Helm sample chart for Kubernetes

**Homepage:** <http://finastra.com/>

## Maintainers

| Name     | Email                      | Url |
|----------|----------------------------|-----|
| aandrieu | alban.andrieu@finastra.com |     |

## Source Code

* <https://scm-git-eur.misys.global.ad/projects/RKTMP/repos/bower-fr-integration-test/browse>

## Values

| Key                          | Type   | Default                                               | Description |
|------------------------------|--------|-------------------------------------------------------|-------------|
| affinity                     | object | `{}`                                                  |             |
| fullnameOverride             | string | `""`                                                  |             |
| global.imagePullPolicy       | string | `"IfNotPresent"`                                      |             |
| global.registry              | string | `"p21d13401013001.azurecr.io"`                        |             |
| global.storageClassName      | string | `"local-path"`                                        |             |
| image.repository             | string | `"fusion-risk/bower-fr-integration-test"`             |             |
| image.tag                    | string | `"latest"`                                            |             |
| imagePullSecrets[0].name     | string | `"p21d13401013001"`                                   |             |
| ingress.annotations          | object | `{}`                                                  |             |
| ingress.enabled              | bool   | `true`                                                |             |
| ingress.hosts[0].host        | string | `"helm-sample.devops-fr.devops.misys.global.ad"`      |             |
| ingress.hosts[0].paths[0]    | string | `"/"`                                                 |             |
| ingress.hosts[1].host        | string | `"helm-sample.treasury-trba1.devops.misys.global.ad"` |             |
| ingress.hosts[1].paths[0]    | string | `"/old(/|$)(.*)"`                                     |             |
| ingress.hosts[2].host        | string | `"chart-example.local"`                               |             |
| ingress.hosts[2].paths[0]    | string | `"/one(/|$)(.*)"`                                     |             |
| ingress.hosts[3].host        | string | `"chart-example.local"`                               |             |
| ingress.hosts[3].paths[0]    | string | `"/two(/|$)(.*)"`                                     |             |
| ingress.tls                  | list   | `[]`                                                  |             |
| mysql.enabled                | bool   | `true`                                                |             |
| nameOverride                 | string | `""`                                                  |             |
| nodeSelector                 | object | `{}`                                                  |             |
| podSecurityContext           | object | `{}`                                                  |             |
| replicaCount                 | int    | `1`                                                   |             |
| resources.limits.cpu         | float  | `2.5`                                                 |             |
| resources.limits.memory      | string | `"1Gi"`                                               |             |
| resources.requests.cpu       | string | `"100m"`                                              |             |
| resources.requests.memory    | string | `"512Mi"`                                             |             |
| securityContext.runAsNonRoot | bool   | `true`                                                |             |
| securityContext.runAsUser    | int    | `1100`                                                |             |
| service.port                 | int    | `8080`                                                |             |
| service.type                 | string | `"NodePort"`                                          |             |
| serviceAccount.annotations   | object | `{}`                                                  |             |
| serviceAccount.create        | bool   | `true`                                                |             |
| serviceAccount.name          | string | `nil`                                                 |             |
| tags.back-end                | bool   | `true`                                                |             |
| tags.front-end               | bool   | `false`                                               |             |
| tolerations                  | list   | `[]`                                                  |             |

----------------------------------------------
Autogenerated from chart metadata using [helm-docs v1.5.0](https://github.com/norwoodj/helm-docs/releases/v1.5.0)
