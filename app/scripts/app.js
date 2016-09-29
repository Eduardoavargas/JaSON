angular.module('JaSON', [
        'ui.bootstrap',
        'LocalStorageModule',
        'hljs'
    ])

    .config(function (hljsServiceProvider) {
        hljsServiceProvider.setOptions({
            tabReplace: '    '
        });
    })

    .config(function (localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('JaSON');
    })

    .constant('referenceData', {

            version: '3.0.4',

            httpMethods: [
                'GET',
                'POST',
                'PUT',
                'PATCH',
                'DELETE',
                'HEAD'
            ],

            contentTypes: [
                {
                    name: 'JSON (application/json)',
                    value: 'application/json'
                },
                {
                    name: 'XML (text/xml)',
                    value: 'text/xml'
                },
                {
                    name: 'XML (application/xml)',
                    value: 'application/xml'
                },
                {
                    name: 'Form encoded',
                    value: 'application/x-www-form-urlencoded'
                },
                {
                    name: 'None',
                    value: undefined
                }
            ],

            requestBodyPlaceholder: 'JSON or XML content.\n\n\'Form encoded\' requests can contain JSON content which will be converted to form request parameters.\n\n\'JSON\' and \'XML\' requests pass the content through in the request body and hence is only available for POST and PUT methods.',

            responseCodes: {

                '-1': 'Error',

                '100': 'Continue',
                '101': 'Switching Protocols',
                '102': 'Processing',

                // success
                '200': 'OK',
                '201': 'Created',
                '202': 'Accepted',
                '203': 'Non-Authoritative Information',
                '204': 'No Content',
                '205': 'Reset Content',
                '206': 'Partial Content',
                '207': 'Multi-Status',
                '208': 'Already Reported',
                '226': 'IM Used',
                '300': 'Multiple Choices',
                '301': 'Moved Permanently',
                '302': 'Found',
                '303': 'See Other',
                '304': 'Not Modified',
                '305': 'Use Proxy',
                '306': '(Unused)',
                '307': 'Temporary Redirect',
                '308': 'Permanent Redirect',

                // error
                '400': 'Bad Request',
                '401': 'Unauthorized',
                '402': 'Payment Required',
                '403': 'Forbidden',
                '404': 'Not Found',
                '405': 'Method Not Allowed',
                '406': 'Not Acceptable',
                '407': 'Proxy Authentication Required',
                '408': 'Request Timeout',
                '409': 'Conflict',
                '410': 'Gone',
                '411': 'Length Required',
                '412': 'Precondition Failed',
                '413': 'Payload Too Large',
                '414': 'URI Too Long',
                '415': 'Unsupported Media Type',
                '416': 'Range Not Satisfiable',
                '417': 'Expectation Failed',
                '422': 'Unprocessable Entity',
                '423': 'Locked',
                '424': 'Failed Dependency',
                '425': 'Unassigned',
                '426': 'Upgrade Required',
                '427': 'Unassigned',
                '428': 'Precondition Required',
                '429': 'Too Many Requests',
                '430': 'Unassigned',
                '431': 'Request Header Fields Too Large',
                '500': 'Internal Server Error',
                '501': 'Not Implemented',
                '502': 'Bad Gateway',
                '503': 'Service Unavailable',
                '504': 'Gateway Timeout',
                '505': 'HTTP Version Not Supported',
                '506': 'Variant Also Negotiates',
                '507': 'Insufficient Storage',
                '508': 'Loop Detected',
                '509': 'Unassigned',
                '510': 'Not Extended',
                '511': 'Network Authentication Required'
            }

        }
    );
