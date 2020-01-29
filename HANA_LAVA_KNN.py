#!/usr/bin/env python
# coding: utf-8

# # import related dict.

# In[35]:


import numpy as np 
from sklearn import preprocessing, neighbors
from sklearn.model_selection import cross_validate
import pandas as pd 
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
from matplotlib import style
from sklearn.cluster import KMeans
from sklearn.neighbors import KNeighborsClassifier
from sklearn import utils
from flask import Flask, render_template, flash, request, url_for

# # read the data from survey

# In[36]:


df1 = pd.read_excel('HANA.19.JAN.xlsx')

df1.head()
# # check the shape and data

# In[37]:


df1.shape


# In[38]:


df1.head()


# # drop unrelated columns

# In[39]:


df1.drop(['4. Select your Study Program name'], 1, inplace=True)


# In[40]:


df1.shape


# # Which course would you like to predict

# In[41]:


df2 = ['Learning Analytics']


# In[42]:


df = df1[df1['6. Select the course name'].isin(df2)]


# In[43]:


df.shape


# In[44]:


#df.drop((df.columns[0]), axis=0, inplace=True)


# In[45]:


df.head()


# # after select the course, drop that column to model preperation

# In[46]:


df.drop(['6. Select the course name'], axis=1, inplace=True)


# In[47]:


df.drop(['7. Rate your difficulty level of this course *'], axis=1, inplace=True)


# In[48]:


df.drop(['5. Select your Language Level [German]'], axis=1, inplace=True)


# In[49]:


df.drop(['8. What was the main language of the course?'], axis=1, inplace=True)


# In[50]:


df.head()


# In[51]:


df.shape


# # we need integers for KNN

# In[52]:


def handle_non_numerical_data(df):
    columns = df.columns.values
    for column in columns:
        text_digit_vals = {}
        def convert_to_int(val):
            return text_digit_vals[val]

        if df[column].dtype != np.int64 and df[column].dtype != np.float64:
            column_contents = df[column].values.tolist()
            unique_elements = set(column_contents)
            x = 0
            for unique in unique_elements:
                if unique not in text_digit_vals:
                    text_digit_vals[unique] = x
                    x+=1

            df[column] = list(map(convert_to_int, df[column]))

    return df

df = handle_non_numerical_data(df)
print(df.head())


# In[53]:


df.shape


# # Features

# In[54]:


X=np.array(df.drop(['Enter the grade you earned in this course. (If you failed, please write 0)'],axis=1))


# In[55]:


X


# In[56]:


#X = preprocessing.scale(X)


# # Label

# In[57]:


y1=np.array(df['Enter the grade you earned in this course. (If you failed, please write 0)'])


# In[58]:


y1


# In[59]:


#y = preprocessing.scale(y1)


# In[60]:


#clf = KMeans(n_clusters=4)


# # Get rid of the continous number with encoder

# In[61]:


lab_enc = preprocessing.LabelEncoder()


# In[62]:


y = lab_enc.fit_transform(y1)


# In[63]:


y


# # fit the model

# In[64]:


neigh = KNeighborsClassifier(n_neighbors=3)


# In[65]:


neigh.fit(X, y)


# # prediction

# In[66]:


predicted_note = neigh.predict([[0, 1, 0, 2, 3, 2, 1, 0, 1, 1]])
predicted_note


# # Inverse the prediction

# In[67]:


z=lab_enc.inverse_transform([predicted_note])


# In[68]:
print(z)


