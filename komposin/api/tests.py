# -*- coding: utf-8 -*-
import oss2
from oss2.credentials import EnvironmentVariableCredentialsProvider
import requests

# Use the AccessKey pair of the RAM user obtained from the environment variables to configure the access credentials.
auth = oss2.ProviderAuth(EnvironmentVariableCredentialsProvider())

# Use auth for subsequent operations.

endpoint = 'oss-ap-southeast-5.aliyuncs.com'
# Specify the region of the endpoint. Example: cn-hangzhou. 
region = 'oss-ap-southeast-5'


bucket = oss2.Bucket(auth, endpoint=endpoint, bucket_name='test-komposin') 
object_name = 'image_1724927329827.jpeg'

# Set the validity period of the signed URL to 3,600 seconds. 
# Set the slash_safe parameter to True to prevent OSS from identifying the forward slashes (/) in the full path of the object as escape characters. This allows you to use the generated signed URL to download the object. 
url = bucket.sign_url('GET', object_name, 3600, slash_safe=True)
print('The signed URL:', url) 

