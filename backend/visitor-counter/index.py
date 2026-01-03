import json
import os
import psycopg2
from datetime import date

def handler(event: dict, context) -> dict:
    '''API для подсчёта посетителей сайта'''
    method = event.get('httpMethod', 'GET')
    
    # Handle CORS preflight
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
    
    # Connect to database
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if method == 'POST':
            # Increment visitor count for today
            today = date.today()
            cur.execute("""
                INSERT INTO visitors (visit_date, visit_count) 
                VALUES (%s, 1)
                ON CONFLICT (visit_date) 
                DO UPDATE SET visit_count = visitors.visit_count + 1
                RETURNING visit_count
            """, (today,))
            count = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'count': count, 'date': str(today)})
            }
        
        elif method == 'GET':
            # Get total visitors count
            cur.execute("SELECT SUM(visit_count) FROM visitors")
            total = cur.fetchone()[0] or 0
            
            # Get today's count
            today = date.today()
            cur.execute("SELECT visit_count FROM visitors WHERE visit_date = %s", (today,))
            result = cur.fetchone()
            today_count = result[0] if result else 0
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'total': total,
                    'today': today_count
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
