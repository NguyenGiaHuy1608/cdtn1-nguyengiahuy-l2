import os, tempfile, unittest

class ModuleTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.NamedTemporaryFile(delete=False,suffix='.db'); self.tmp.close()
        os.environ['DATABASE_PATH']=self.tmp.name
        from src.db import init_db
        init_db(seed=True)
        from src.app import create_app
        self.app=create_app({'TESTING':True,'INIT_DB':False})
        self.client=self.app.test_client()
    def tearDown(self):
        try: os.unlink(self.tmp.name)
        except OSError: pass
        os.environ.pop('DATABASE_PATH',None)
    def test_happy_path_create_ticket(self):
        response=self.client.post('/api/tickets',json={'customer_id':1,'device_id':1,'category_id':1,'issue_desc':'Màn hình nhấp nháy liên tục','priority':'TRUNG_BINH'})
        self.assertEqual(response.status_code,201)
        self.assertTrue(response.json['data']['ticket_code'].startswith('BH-'))
    def test_customer_lookup_by_phone(self):
        response=self.client.get('/api/customers?phone=0901234567')
        self.assertEqual(response.status_code,200)
        self.assertEqual(response.json['data']['phone'],'0901234567')

    def test_invalid_customer_phone_rejected(self):
        response=self.client.post('/api/customers',json={'full_name':'Test User','phone':'123','email':''})
        self.assertEqual(response.status_code,400)
        self.assertEqual(response.json['error'],'DU_LIEU_KHONG_HOP_LE')
    def test_expired_warranty_rejected(self):
        response=self.client.post('/api/tickets',json={'customer_id':2,'device_id':2,'category_id':1,'issue_desc':'Thiết bị không lên nguồn','priority':'CAO'})
        self.assertEqual(response.status_code,422)
        self.assertEqual(response.json['error'],'BAO_HANH_HET_HAN')
    def test_duplicate_open_ticket_rejected(self):
        payload={'customer_id':1,'device_id':1,'category_id':1,'issue_desc':'Màn hình nhấp nháy liên tục','priority':'TRUNG_BINH'}
        self.assertEqual(self.client.post('/api/tickets',json=payload).status_code,201)
        response=self.client.post('/api/tickets',json=payload)
        self.assertEqual(response.status_code,409)
        self.assertEqual(response.json['error'],'PHIEU_DANG_MO')

if __name__ == '__main__': unittest.main()
