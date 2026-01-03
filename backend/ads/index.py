import json
import os
import psycopg2
from datetime import date, datetime

def handler(event: dict, context) -> dict:
    '''API для управления рекламными объявлениями'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            cur.execute("""
                SELECT id, company_name, ad_title, ad_description, ad_url, 
                       image_url, start_date, end_date
                FROM advertisements
                WHERE status = 'active' 
                  AND payment_confirmed = true
                  AND start_date <= CURRENT_DATE 
                  AND end_date >= CURRENT_DATE
                ORDER BY RANDOM()
                LIMIT 1
            """)
            
            row = cur.fetchone()
            if row:
                ad = {
                    'id': row[0],
                    'company_name': row[1],
                    'ad_title': row[2],
                    'ad_description': row[3],
                    'ad_url': row[4],
                    'image_url': row[5],
                    'start_date': str(row[6]),
                    'end_date': str(row[7])
                }
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps(ad)
                }
            else:
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'message': 'No active ads'})
                }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            cur.execute("""
                INSERT INTO advertisements 
                (company_name, contact_email, contact_phone, ad_title, ad_description, 
                 ad_url, image_url, price_per_day, start_date, end_date, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'pending')
                RETURNING id
            """, (
                body['company_name'],
                body['contact_email'],
                body.get('contact_phone', ''),
                body['ad_title'],
                body['ad_description'],
                body.get('ad_url', ''),
                body.get('image_url', ''),
                body['price_per_day'],
                body['start_date'],
                body['end_date']
            ))
            
            ad_id = cur.fetchone()[0]
            conn.commit()
            
            days = (datetime.strptime(body['end_date'], '%Y-%m-%d').date() - 
                   datetime.strptime(body['start_date'], '%Y-%m-%d').date()).days + 1
            total_cost = float(body['price_per_day']) * days
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'id': ad_id,
                    'message': 'Ad request submitted',
                    'payment_phone': '+79045242283',
                    'total_cost': total_cost,
                    'days': days
                })
            }
    
    finally:
        cur.close()
        conn.close()
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'})
    }
