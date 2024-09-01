import dashscope, oss2, time, json
from django.http import HttpResponse, JsonResponse
from http import HTTPStatus
from dashscope import MultiModalConversation
from oss2.credentials import EnvironmentVariableCredentialsProvider
from django.db import connection
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_exempt
from .models import Product
from datetime import datetime, timezone

dashscope.base_http_api_url = 'https://dashscope-intl.aliyuncs.com/api/v1'

# def image_detection(request):

#     image_url = request.GET.get('image_url', None)

#     # Use the AccessKey pair of the RAM user obtained from the environment variables to configure the access credentials.
#     auth = oss2.ProviderAuth(EnvironmentVariableCredentialsProvider())

#     # Use auth for subsequent operations.

#     endpoint = 'oss-ap-southeast-5.aliyuncs.com'
#     # Specify the region of the endpoint. Example: cn-hangzhou. 
#     region = 'oss-ap-southeast-5'

#     bucket = oss2.Bucket(auth, endpoint=endpoint, bucket_name='test-komposin') 
#     object_name = image_url

#     # Set the validity period of the signed URL to 3,600 seconds. 
#     # Set the slash_safe parameter to True to prevent OSS from identifying the forward slashes (/) in the full path of the object as escape characters. This allows you to use the generated signed URL to download the object. 
#     url = bucket.sign_url('GET', object_name, 3600)
#     print(url)
#     if image_url:
#         """Simple single round multimodal conversation call.
#         """

#         messages = [{
#             "role": "system",
#             "content": 
#             [
#                 {
#                     "text": "You are an assistant who acts like an object recogniser."
#                 }
#             ]
#         }, {
#             "role":"user",
#             "content": 
#             [
#                     {
#                         "image": f'''{url}'''
#                     },
#                     {
#                         "text": '''You are an image analysis model. Please analyze the provided image by following these steps:
# 1.  Identify the Most Dominant Object: Determine the most visually prominent object in the image.
# 2.  Assess Living Association: Evaluate whether this object is associated with a living being, including humans, animals, or any related elements (such as occupations, roles, or classifications).
# 3.  Classification Response:
# - If the object is linked to a living being, respond with 'living being.'
# - If the object is not linked to a living being, return the specific name of the object.
# 4.  Final Output: Provide your result as a single word or short phrase, enclosed in double quotes.
# Now, process the image. in the image. Assess Living Association: Evaluate if this object is connected to any living being, including humans, animals, or related elements (such as occupations, roles, or classifications). If the object is associated with a living being, classify it as "living being". else the object is not associated with a living being, proceed to the next step. Present the final result as a single word or short phrase, enclosed in double quotes.
#                                 '''
#                                 #return only object name and organic or non organic type base of image you capture of the most dominant object in this picture and wrap it with double quote and delimiter with semicolon
#                     }
#             ]
#         }]

#         responses = MultiModalConversation.call(model='qwen-vl-max',
#                                             messages=messages,
#                                             stream=True,
#                                             top_p=0.1)
#         full_content = ''

#         for response in responses:
#             if response.status_code == HTTPStatus.OK:
#                 if (response.output.choices[0]['finish_reason'] == 'stop'):
#                     full_content += response.output.choices[0]['message']['content'][0]['text']
#             else:
#                 print('Request id: %s, Status code: %s, error code: %s, error message: %s' % (
#                     response.request_id, response.status_code,
#                     response.code, response.message
#                 ))
        
#         content = full_content.replace('"', '').lower()
#         msg_living_being = '''{"stage": "nothing to do", "topics": [{"topic": "nothing to do", "description":"nothing to do"}]}'''
#         organic = detect_oganic(full_content.replace('"',''))

#         if "living being" in content:
#             data_parse = '''{"object":"''' + content + '''",''' + '''"object_todo":[''' + msg_living_being + "]}"
#         else:
#             if "non-organic" in organic:
#                 data_parse = '''{"object":"''' + content + '''",''' + '''"object_todo":[''' + msg_living_being + "]}"
#             else:
#                 data_parse = object_todo(full_content.replace('"', ''))

#         print("image_detection : " + content)
#         print("detect_organict : " + organic)
#         return HttpResponse(data_parse)

# def detect_oganic(object):
    
#     # object = request.GET.get('object', None)

#     if object:
#         messages = [{
#             "role": "system",
#             "content": 
#             [
#                 {
#                     "text": "You are a great assistant"
#                 }
#             ]
#         }, {
#             "role":"user",
#             "content": 
#             [
#                     {
#                         "text": 
#                         # '''hola'''
#                         f'''  
#                             is {object} an organic or non-organic object?
#                             only return "organic" or "non-organic"
#                         '''
#                     }
#             ]
#         }]
#         responses = dashscope.Generation.call(
#             'qwen-max',
#             messages=messages,
#             result_format='message',  # set the result to be "message"  format.
#             stream=True,
#             incremental_output=True,  # get streaming output incrementally
#             top_k=1,
#             top_p=0.1,
#             temperature=0.1
#         )

#         full_content = ''
        
#         for response in responses:
#             if response.status_code == HTTPStatus.OK:
#                 # full_content += response.output.choices[len(response.output.choices)-1]['message']['content']
#                 if (response.output.choices[0]['finish_reason'] == 'stop'):
#                     full_content += response.output.choices[0]['message']['content']

#                 full_content += response.output.choices[0]['message']['content']
                
#             else:
#                 full_content = ('Request id: %s, Status code: %s, error code: %s, error message: %s' % (
#                     response.request_id, response.status_code,
#                     response.code, response.message
#                 ))
                
#         print(full_content)
#         return full_content.lower()

# def object_todo(object):
    
#     # object = request.GET.get('object', None)
#     time.sleep(3)
#     if object:
#         messages = [{
#             "role": "system",
#             "content": 
#             [
#                 {
#                     "text": "You are a great neighbourhood care assistant that can only use english language"
#                 }
#             ]
#         }, {
#             "role":"user",
#             "content": 
#             [
#                     {
#                         "text": 
#                         # '''hola'''
#                         f'''
#                             I have {object} 
#                             please tell me only on english language what kind of things I can use from the {object} waste, 
#                             divide it into several stages starting from those that can be used immediately, need a short time processing, and need a long time processing.
#                             You don't have to answer questions that don't make sense, if you find that the object is a living being such as a human or animal that .

#                             I want you to only return it as only json with format like this

#                             "stage":"immediate use",
#                             "topics":[
#                                 "topic": "a",
#                                 "description": "a"
#                             ]

#                             and make it possible to work properly with backend language,
#                             please don't add anything that not needed to parse to backend and you dont need to add this ```json```
#                             and the last, translate only value on each element result into bahasa
#                         '''
#                     }
#             ]
#         }]
#         responses = dashscope.Generation.call(
#             'qwen-max',
#             messages=messages,
#             result_format='message',  # set the result to be "message"  format.
#             stream=True,
#             incremental_output=True,  # get streaming output incrementally
#             top_k=1,
#             top_p=0.7,
#             temperature=0.1
#         )

#         full_content = ''
        
#         for response in responses:
#             if response.status_code == HTTPStatus.OK:
#                 # full_content += response.output.choices[len(response.output.choices)-1]['message']['content']
#                 if (response.output.choices[0]['finish_reason'] == 'stop'):
#                     full_content += response.output.choices[0]['message']['content']

#                 full_content += response.output.choices[0]['message']['content']
                
#             else:
#                 full_content = ('Request id: %s, Status code: %s, error code: %s, error message: %s' % (
#                     response.request_id, response.status_code,
#                     response.code, response.message
#                 ))
                
#         if "stage" in full_content:
#             data_parse = '''{"object":"''' + object + '''",''' + '''"object_todo":[''' + full_content.replace('```json','').replace('```', '') + "]}"
#         else:
#             data_parse = '''{"object":"''' + object + '''",''' + '''"object_todo":[{"message":"''' + full_content.replace('```json','').replace('```', '') + '''"}]}'''
#         # final_content = '''{"content":[''' + full_content + ''']}'''
#         # return HttpResponse(JsonResponse(eval(final_content), safe=False))
#         print(data_parse)
#         return HttpResponse(data_parse)

# def how_to(request):
#     messages = [{
#         "role": "system",
#         "content": 
#         [
#             {
#                 "text": "You are a great neighbourhood care assistant that can only use english language"
#             }
#         ]
#     }, {
#         "role":"user",
#         "content": 
#         [
#                 {
#                     "text": 
#                     # '''hola'''
#                     '''
#                         I have a banana 
#                         please tell me only on english language what kind of things I can use from the banana waste, 
#                         divide it into several stages starting from those that can be used immediately, need a short processing time, and need a long processing time.

#                         I want you to only return it as only json with format like this
#                         {stage:immediate use,
#                         {topics:[
#                             topic: a,
#                             description: a
#                         ]}
#                     '''

#                     #     and make it possible to work properly with backend language
#                     # '''
#                 }
#         ]
#     }]
#     responses = dashscope.Generation.call(
#         'qwen-max',
#         messages=messages,
#         result_format='message',  # set the result to be "message"  format.
#         stream=True,
#         incremental_output=True  # get streaming output incrementally
#     )

#     full_content = ''
    
#     for response in responses:
#         if response.status_code == HTTPStatus.OK:
#             # full_content += response.output.choices[len(response.output.choices)-1]['message']['content']
#             if (response.output.choices[0]['finish_reason'] == 'stop'):
#                 full_content += response.output.choices[0]['message']['content']

#             full_content += response.output.choices[0]['message']['content']
            
#         else:
#             print('Request id: %s, Status code: %s, error code: %s, error message: %s' % (
#                 response.request_id, response.status_code,
#                 response.code, response.message
#             ))

#     final_content = '''{"content":[''' + full_content + ''']}'''
#     print(eval(final_content))
#     return HttpResponse(JsonResponse(eval(final_content), safe=False))

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'csrftoken': request.META.get('CSRF_COOKIE', '')})

def image_detection(request):

    image_url = request.GET.get('image_url', None)

    # Use the AccessKey pair of the RAM user obtained from the environment variables to configure the access credentials.
    auth = oss2.ProviderAuth(EnvironmentVariableCredentialsProvider())

    # Use auth for subsequent operations.

    endpoint = 'oss-ap-southeast-5.aliyuncs.com'
    # Specify the region of the endpoint. Example: cn-hangzhou. 
    region = 'oss-ap-southeast-5'

    bucket = oss2.Bucket(auth, endpoint=endpoint, bucket_name='object-hack-jbgfivic') 
    object_name = image_url

    # Set the validity period of the signed URL to 3,600 seconds. 
    # Set the slash_safe parameter to True to prevent OSS from identifying the forward slashes (/) in the full path of the object as escape characters. This allows you to use the generated signed URL to download the object. 
    url = bucket.sign_url('GET', object_name, 3600)
    print(url)
    if image_url:
        """Simple single round multimodal conversation call.
        """

        messages = [{
            "role": "system",
            "content": 
            [
                {
                    "text": "You are an assistant who acts like an object recogniser."
                }
            ]
        }, {
            "role":"user",
            "content": 
            [
                    {
                        "image": f'''{url}'''
                    },
                    {
                        "text": '''
                                    Please analyze base on your vision the provided image by following these steps and criteria and return only on english:

                                    1. Detect Object Names: Identify as detailed as possible fresh ingredients then list the names of all objects present in the image
                                    2. Determine Expiration: For each object identified, specify how long it can be kept in the fridge before wilting, without providing a range of days
                                    3. Format Result: Present the results in the format: "object name":"integer of day expired"
                                    4. Output: Return only the formatted results, separated only use ";" if you identify more than 1 object dont return multiple object name
                                '''
                                #return only object name and organic or non organic type base of image you capture of the most dominant object in this picture and wrap it with double quote and delimiter with semicolon
                    }
            ]
        }]

        responses = MultiModalConversation.call(model='qwen-vl-plus',
                                            messages=messages,
                                            stream=True)
        full_content = ''

        for response in responses:
            if response.status_code == HTTPStatus.OK:
                if (response.output.choices[0]['finish_reason'] == 'stop'):
                    full_content += response.output.choices[0]['message']['content'][0]['text']
            else:
                print('Request id: %s, Status code: %s, error code: %s, error message: %s' % (
                    response.request_id, response.status_code,
                    response.code, response.message
                ))
        
        full_content = full_content.replace('"','')
        full_content_array = full_content.split(';')
        object_json = ''
        object_name = ''
        print(full_content)
        print(full_content_array)
        if full_content != "; ;" or full_content != "" or full_content != ";":
            for content in full_content_array:
                if full_content_array[len(full_content_array)-1] != '':
                    if not '':
                            content_details = content.split(":")
                            if content_details[0].startswith(' '):
                                content_details[0] = content_details[0].strip()

                            if content_details[1].startswith(' '):
                                content_details[1] = "1"

                    if (content == full_content_array[len(full_content_array)-1]):
                        object_name =  object_name + '''{"object_name":"''' + content_details[0] + '''","day_expired":"''' + content_details[1] + '''"}'''
                    else:
                        object_name =  object_name + '''{"object_name":"''' + content_details[0] + '''","day_expired":"''' + content_details[1] + '''"},'''
        else:
             object_name =  object_name + '''{"object_name":"undefined","day_expired":"0"}'''

        print("object_name " + object_name)
        if object_name.endswith(","):
            object_name = object_name.replace(",","")

        object_json = object_json + str(object_name)
        data_parse = '''{"objects": [''' + object_json + ''']}'''

        return HttpResponse(data_parse)

# @csrf_exempt
# def insert_db(request):

#     if request.method == 'POST':
#         try:
#             # Parse the JSON request body
#             body = json.loads(request.body)
#             queries = body.get('queries')

#             # Split the queries by newline and execute each one
#             for query in queries.split('\n'):
#                 if query.strip():  # Skip empty lines
#                     # Here, execute the query
#                     # Note: You should avoid raw SQL in production, use Django ORM instead
#                     with connection.cursor() as cursor:
#                         cursor.execute(query)

#             return JsonResponse({'message': 'Objects inserted successfully!'}, status=200)
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=400)
#     else:
#         return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def insert_db(request):
    if request.method == 'POST':
        # Parse and process the incoming JSON data
        data = request.body.decode('utf-8')
        # Perform the database insertion logic here
        body = json.loads(data)
        queries = body.get('queries')

        with connection.cursor() as cursor:
            cursor.execute(queries)

        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'invalid request'}, status=400)

def get_data_all(request):
    products = Product.objects.values('product_name', 'qty', 'uom', 'due_date')
    date_now = datetime.now().replace(tzinfo=timezone.utc)

    processed_products = []
    for product in products:
        days_lefts = product['due_date'] - date_now # Adding 10.00 to the original price
        days_left = days_lefts.days
        processed_products.append({
            'product_name': product['product_name'],
            'uom': product['uom'],
            'qty': product['qty'],
            'due_date': product['due_date'],
            'days_left': days_left
        })

    print(processed_products)
    return JsonResponse(list(processed_products), safe=False)


def object_todo(request):
    
    object = request.GET.get('object', None)
    time.sleep(3)
    if object:
        messages = [{
            "role": "system",
            "content": 
            [
                {
                    "text": "Kamu adalah asisten yang hebat"
                }
            ]
        }, {
            "role":"user",
            "content": 
            [
                    {
                        "text": 
                        # '''hola'''
                        f'''
                            berikan informasi tentang pemanfaatan maksimal pada bahan sisa makanan sebagai berikut :
                            1. tata cara penyimpanan {object} yang baik. agar tidak cepat rusak dan dibuang
                            2. bagaimana sisa {object} dapat dimanfatkan kembali sehingga tidak dibuang menjadi sampah. mencakup manfaat penggunaan sisa bahan makanan dalam kehidupan berumah tangga secara lebih luas
                            3. langkah terakhir jika {object} tidak bisa digunakan kembali maka akan mengajari cara mengkompos
                            berikan informasi ini untuk {object}

                            untuk poin nomor 1, berikan informasi tentang penyimpanan bahan nya juga. jadi bukan hanya bahan sisanya
                            poin nomor 2 tambahkan informasi tentang kandungan zat yang terdapat pada bahan makanan sehingga dapat berfungsi demikian
                            beritahu saya hanya dalam bentuk html
                        '''
                    }
            ]
        }]
        responses = dashscope.Generation.call(
            'qwen-max',
            messages=messages,
            result_format='message',  # set the result to be "message"  format.
            stream=True,
            incremental_output=True,  # get streaming output incrementally
            top_k=1,
            top_p=0.3,
            temperature=0.1
        )

        full_content = ''
        
        for response in responses:
            if response.status_code == HTTPStatus.OK:
                # full_content += response.output.choices[len(response.output.choices)-1]['message']['content']
                if (response.output.choices[0]['finish_reason'] == 'stop'):
                    full_content += response.output.choices[0]['message']['content']

                full_content += response.output.choices[0]['message']['content']
                
            else:
                full_content = ('Request id: %s, Status code: %s, error code: %s, error message: %s' % (
                    response.request_id, response.status_code,
                    response.code, response.message
                ))
                
        print(full_content)
        return HttpResponse(full_content)

def generate_recipe(request):
    
    object = request.GET.get('object', None)
    time.sleep(3)
    if object:
        messages = [{
            "role": "system",
            "content": 
            [
                {
                    "text": "Kamu adalah asisten yang hebat"
                }
            ]
        }, {
            "role":"user",
            "content": 
            [
                    {
                        "text": 
                        # '''hola'''
                        f'''
                            dari bahan {object} buatkan saya resep masakan
                            dan beritahu saya hanya dalam bentuk html code tidak ada kalimat lain
                        '''
                    }
            ]
        }]
        responses = dashscope.Generation.call(
            'qwen-max',
            messages=messages,
            result_format='message',  # set the result to be "message"  format.
            stream=True,
            incremental_output=True,  # get streaming output incrementally
            top_k=1,
            top_p=0.3,
            temperature=0.1
        )

        full_content = ''
        
        for response in responses:
            if response.status_code == HTTPStatus.OK:
                # full_content += response.output.choices[len(response.output.choices)-1]['message']['content']
                if (response.output.choices[0]['finish_reason'] == 'stop'):
                    full_content += response.output.choices[0]['message']['content']

                full_content += response.output.choices[0]['message']['content']
                
            else:
                full_content = ('Request id: %s, Status code: %s, error code: %s, error message: %s' % (
                    response.request_id, response.status_code,
                    response.code, response.message
                ))
                
        print(full_content)
        return HttpResponse(full_content)